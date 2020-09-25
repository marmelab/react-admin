import React, {
    useCallback,
    useEffect,
    useRef,
    FunctionComponent,
    useMemo,
    isValidElement,
} from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import classNames from 'classnames';
import get from 'lodash/get';
import { TextField, Chip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextFieldProps } from '@material-ui/core/TextField';
import {
    useInput,
    FieldTitle,
    ChoicesInputProps,
    useSuggestions,
    warning,
} from 'ra-core';

import InputHelperText from './InputHelperText';
import AutocompleteSuggestionList from './AutocompleteSuggestionList';
import AutocompleteSuggestionItem from './AutocompleteSuggestionItem';

interface Options {
    suggestionsContainerProps?: any;
    labelProps?: any;
}

/**
 * An Input component for an autocomplete field, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <AutocompleteArrayInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteArrayInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteArrayInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * Note that you must also specify the `matchSuggestion` prop
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const matchSuggestion = (filterValue, choice) => choice.first_name.match(filterValue) || choice.last_name.match(filterValue);
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectInput source="gender" choices={choices} optionText={<FullNameField />} matchSuggestion={matchSuggestion} />
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <AutocompleteArrayInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 *
 * @example
 * <AutocompleteArrayInput source="author_id" options={{ color: 'secondary' }} />
 */
const AutocompleteArrayInput: FunctionComponent<
    ChoicesInputProps<TextFieldProps & Options> &
        Omit<DownshiftProps<any>, 'onChange'>
> = props => {
    const {
        allowDuplicates,
        allowEmpty,
        classes: classesOverride,
        choices = [],
        emptyText,
        emptyValue,
        format,
        fullWidth,
        helperText,
        id: idOverride,
        input: inputOverride,
        isRequired: isRequiredOverride,
        label,
        limitChoicesToValue,
        margin = 'dense',
        matchSuggestion,
        meta: metaOverride,
        onBlur,
        onChange,
        onFocus,
        options: {
            suggestionsContainerProps,
            labelProps,
            InputProps,
            ...options
        } = {} as TextFieldProps & Options,
        optionText = 'name',
        optionValue = 'id',
        parse,
        resource,
        setFilter,
        shouldRenderSuggestions: shouldRenderSuggestionsOverride,
        source,
        suggestionLimit,
        translateChoice = true,
        validate,
        variant = 'filled',
        ...rest
    } = props;
    warning(
        isValidElement(optionText) && !matchSuggestion,
        `If the optionText prop is a React element, you must also specify the matchSuggestion prop:
<AutocompleteArrayInput
    matchSuggestion={(filterValue, suggestion) => true}
/>
        `
    );

    warning(
        source === undefined,
        `If you're not wrapping the AutocompleteArrayInput inside a ReferenceArrayInput, you must provide the source prop`
    );

    warning(
        choices === undefined,
        `If you're not wrapping the AutocompleteArrayInput inside a ReferenceArrayInput, you must provide the choices prop`
    );

    const classes = useStyles(props);

    let inputEl = useRef<HTMLInputElement>();
    let anchorEl = useRef<any>();

    const {
        id,
        input,
        isRequired,
        meta: { touched, error },
    } = useInput({
        format,
        id: idOverride,
        input: inputOverride,
        meta: metaOverride,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const values = input.value || emptyArray;

    const [filterValue, setFilterValue] = React.useState('');

    const getSuggestionFromValue = useCallback(
        value => choices.find(choice => get(choice, optionValue) === value),
        [choices, optionValue]
    );

    const selectedItems = useMemo(() => values.map(getSuggestionFromValue), [
        getSuggestionFromValue,
        values,
    ]);

    const { getChoiceText, getChoiceValue, getSuggestions } = useSuggestions({
        allowDuplicates,
        allowEmpty,
        choices,
        emptyText,
        emptyValue,
        limitChoicesToValue,
        matchSuggestion,
        optionText,
        optionValue,
        selectedItem: selectedItems,
        suggestionLimit,
        translateChoice,
    });

    const handleFilterChange = useCallback(
        (eventOrValue: React.ChangeEvent<{ value: string }> | string) => {
            const event = eventOrValue as React.ChangeEvent<{ value: string }>;
            const value = event.target
                ? event.target.value
                : (eventOrValue as string);

            setFilterValue(value);
            if (setFilter) {
                setFilter(value);
            }
        },
        [setFilter, setFilterValue]
    );

    // We must reset the filter every time the value changes to ensure we
    // display at least some choices even if the input has a value.
    // Otherwise, it would only display the currently selected one and the user
    // would have to first clear the input before seeing any other choices
    useEffect(() => {
        handleFilterChange('');
    }, [values.join(','), handleFilterChange]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            // Remove latest item from array when user hits backspace with no text
            if (
                selectedItems.length &&
                !filterValue.length &&
                event.key === 'Backspace'
            ) {
                const newSelectedItems = selectedItems.slice(
                    0,
                    selectedItems.length - 1
                );
                input.onChange(newSelectedItems.map(getChoiceValue));
            }
        },
        [filterValue.length, getChoiceValue, input, selectedItems]
    );

    const handleChange = useCallback(
        (item: any) => {
            let newSelectedItems =
                !allowDuplicates && selectedItems.includes(item)
                    ? [...selectedItems]
                    : [...selectedItems, item];
            setFilterValue('');
            input.onChange(newSelectedItems.map(getChoiceValue));
        },
        [allowDuplicates, getChoiceValue, input, selectedItems, setFilterValue]
    );

    const handleDelete = useCallback(
        item => () => {
            const newSelectedItems = [...selectedItems];
            newSelectedItems.splice(newSelectedItems.indexOf(item), 1);
            input.onChange(newSelectedItems.map(getChoiceValue));
        },
        [input, selectedItems, getChoiceValue]
    );

    // This function ensures that the suggestion list stay aligned to the
    // input element even if it moves (because user scrolled for example)
    const updateAnchorEl = () => {
        if (!inputEl.current) {
            return;
        }

        const inputPosition = inputEl.current.getBoundingClientRect() as DOMRect;

        // It works by implementing a mock element providing the only method used
        // by the PopOver component, getBoundingClientRect, which will return a
        // position based on the input position
        if (!anchorEl.current) {
            anchorEl.current = { getBoundingClientRect: () => inputPosition };
        } else {
            const anchorPosition = anchorEl.current.getBoundingClientRect();

            if (
                anchorPosition.x !== inputPosition.x ||
                anchorPosition.y !== inputPosition.y
            ) {
                anchorEl.current = {
                    getBoundingClientRect: () => inputPosition,
                };
            }
        }
    };

    const storeInputRef = input => {
        inputEl.current = input;
        updateAnchorEl();
    };

    const handleBlur = useCallback(
        event => {
            setFilterValue('');
            handleFilterChange('');
            input.onBlur(event);
        },
        [handleFilterChange, input, setFilterValue]
    );

    const handleFocus = useCallback(
        openMenu => event => {
            openMenu(event);
            input.onFocus(event);
        },
        [input]
    );

    const handleClick = useCallback(
        openMenu => event => {
            if (event.target === inputEl.current) {
                openMenu(event);
            }
        },
        []
    );

    const shouldRenderSuggestions = val => {
        if (
            shouldRenderSuggestionsOverride !== undefined &&
            typeof shouldRenderSuggestionsOverride === 'function'
        ) {
            return shouldRenderSuggestionsOverride(val);
        }

        return true;
    };

    return (
        <Downshift
            inputValue={filterValue}
            onChange={handleChange}
            selectedItem={selectedItems}
            itemToString={item => getChoiceValue(item)}
            {...rest}
        >
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue: suggestionFilter,
                highlightedIndex,
                openMenu,
            }) => {
                const isMenuOpen =
                    isOpen && shouldRenderSuggestions(suggestionFilter);
                const {
                    id: idFromDownshift,
                    onBlur,
                    onChange,
                    onFocus,
                    ref,
                    color,
                    size,
                    ...inputProps
                } = getInputProps({
                    onBlur: handleBlur,
                    onFocus: handleFocus(openMenu),
                    onClick: handleClick(openMenu),
                    onKeyDown: handleKeyDown,
                });
                return (
                    <div className={classes.container}>
                        <TextField
                            id={id}
                            fullWidth={fullWidth}
                            InputProps={{
                                inputRef: storeInputRef,
                                classes: {
                                    root: classNames(classes.inputRoot, {
                                        [classes.inputRootFilled]:
                                            variant === 'filled',
                                    }),
                                    input: classes.inputInput,
                                },
                                startAdornment: (
                                    <div
                                        className={classNames({
                                            [classes.chipContainerFilled]:
                                                variant === 'filled',
                                            [classes.chipContainerOutlined]:
                                                variant === 'outlined',
                                        })}
                                    >
                                        {selectedItems.map((item, index) => (
                                            <Chip
                                                key={index}
                                                tabIndex={-1}
                                                label={getChoiceText(item)}
                                                className={classes.chip}
                                                onDelete={handleDelete(item)}
                                            />
                                        ))}
                                    </div>
                                ),
                                onBlur,
                                onChange: event => {
                                    handleFilterChange(event);
                                    onChange!(
                                        event as React.ChangeEvent<
                                            HTMLInputElement
                                        >
                                    );
                                },
                                onFocus,
                            }}
                            error={!!(touched && error)}
                            label={
                                <FieldTitle
                                    label={label}
                                    {...labelProps}
                                    source={source}
                                    resource={resource}
                                    isRequired={
                                        typeof isRequiredOverride !==
                                        'undefined'
                                            ? isRequiredOverride
                                            : isRequired
                                    }
                                />
                            }
                            InputLabelProps={getLabelProps({
                                htmlFor: id,
                            })}
                            helperText={
                                <InputHelperText
                                    touched={touched}
                                    error={error}
                                    helperText={helperText}
                                />
                            }
                            variant={variant}
                            margin={margin}
                            color={color as any}
                            size={size as any}
                            {...inputProps}
                            {...options}
                        />
                        <AutocompleteSuggestionList
                            isOpen={isMenuOpen}
                            menuProps={getMenuProps(
                                {},
                                // https://github.com/downshift-js/downshift/issues/235
                                { suppressRefError: true }
                            )}
                            inputEl={inputEl.current}
                            suggestionsContainerProps={
                                suggestionsContainerProps
                            }
                        >
                            {getSuggestions(suggestionFilter).map(
                                (suggestion, index) => (
                                    <AutocompleteSuggestionItem
                                        key={getChoiceValue(suggestion)}
                                        suggestion={suggestion}
                                        index={index}
                                        highlightedIndex={highlightedIndex}
                                        isSelected={selectedItems
                                            .map(getChoiceValue)
                                            .includes(
                                                getChoiceValue(suggestion)
                                            )}
                                        filterValue={filterValue}
                                        getSuggestionText={getChoiceText}
                                        {...getItemProps({
                                            item: suggestion,
                                        })}
                                    />
                                )
                            )}
                        </AutocompleteSuggestionList>
                    </div>
                );
            }}
        </Downshift>
    );
};

const emptyArray = [];

const useStyles = makeStyles(
    theme => {
        const chipBackgroundColor =
            theme.palette.type === 'light'
                ? 'rgba(0, 0, 0, 0.09)'
                : 'rgba(255, 255, 255, 0.09)';

        return {
            root: {
                flexGrow: 1,
                height: 250,
            },
            container: {
                flexGrow: 1,
                position: 'relative',
            },
            paper: {
                position: 'absolute',
                zIndex: 1,
                marginTop: theme.spacing(1),
                left: 0,
                right: 0,
            },
            chip: {
                margin: theme.spacing(0.5, 0.5, 0.5, 0),
            },
            chipContainerFilled: {
                margin: '27px 12px 10px 0',
            },
            chipContainerOutlined: {
                margin: '12px 12px 10px 0',
            },
            inputRoot: {
                flexWrap: 'wrap',
            },
            inputRootFilled: {
                flexWrap: 'wrap',
                '& $chip': {
                    backgroundColor: chipBackgroundColor,
                },
            },
            inputInput: {
                width: 'auto',
                flexGrow: 1,
            },
            divider: {
                height: theme.spacing(2),
            },
        };
    },
    { name: 'RaAutocompleteArrayInput' }
);

export default AutocompleteArrayInput;
