import React, {
    useCallback,
    useEffect,
    useRef,
    FunctionComponent,
} from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import classNames from 'classnames';
import get from 'lodash/get';
import { makeStyles, TextField, Chip } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { useTranslate, useInput, FieldTitle, InputProps } from 'ra-core';

import InputHelperText from './InputHelperText';
import getSuggestionsFactory from './getSuggestions';
import AutocompleteSuggestionList from './AutocompleteSuggestionList';
import AutocompleteSuggestionItem from './AutocompleteSuggestionItem';

interface Props {}

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
 * The object passed as `options` props is passed to the material-ui <AutoComplete> component
 *
 * @example
 * <AutocompleteArrayInput source="author_id" options={{ fullWidthInput: true }} />
 */
const AutocompleteArrayInput: FunctionComponent<
    Props & InputProps<TextFieldProps & Options> & DownshiftProps<any>
> = ({
    allowEmpty,
    classes: classesOverride,
    choices = [],
    helperText,
    id: idOverride,
    input: inputOverride,
    isRequired: isRequiredOverride,
    limitChoicesToValue,
    margin,
    meta: metaOverride,
    onBlur,
    onChange,
    onFocus,
    options: {
        suggestionsContainerProps,
        labelProps,
        InputProps,
        ...options
    } = {},
    optionText = 'name',
    optionValue = 'id',
    resource,
    setFilter,
    shouldRenderSuggestions: shouldRenderSuggestionsOverride,
    source,
    suggestionComponent,
    suggestionLimit,
    translateChoice = true,
    validate,
    variant = 'filled',
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles({ classes: classesOverride });

    let inputEl = useRef<HTMLInputElement>();
    let anchorEl = useRef<any>();

    const {
        id,
        input,
        isRequired,
        meta: { touched, error },
    } = useInput({
        id: idOverride,
        input: inputOverride,
        isRequired: isRequiredOverride,
        meta: metaOverride,
        onBlur,
        onChange,
        onFocus,
        resource,
        source,
        validate,
        ...rest,
    });

    const [filterValue, setFilterValue] = React.useState('');

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
        [setFilter]
    );

    // We must reset the filter every time the value changes to ensure we
    // display at least some choices even if the input has a value.
    // Otherwise, it would only display the currently selected one and the user
    // would have to first clear the input before seeing any other choices
    useEffect(() => {
        handleFilterChange('');
    }, [input.value, handleFilterChange]);

    const getSuggestionValue = useCallback(
        suggestion => get(suggestion, optionValue),
        [optionValue]
    );

    const getSuggestionFromValue = useCallback(
        value => choices.find(choice => get(choice, optionValue) === value),
        [choices, optionValue]
    );

    const getSuggestionText = useCallback(
        suggestion => {
            if (!suggestion) return '';

            const suggestionLabel =
                typeof optionText === 'function'
                    ? optionText(suggestion)
                    : get(suggestion, optionText, '');

            return translateChoice
                ? translate(suggestionLabel, { _: suggestionLabel })
                : suggestionLabel;
        },
        [optionText, translate, translateChoice]
    );

    const selectedItems = (input.value || []).map(getSuggestionFromValue);

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
                input.onChange(newSelectedItems.map(getSuggestionValue));
            }
        },
        [filterValue.length, getSuggestionValue, input, selectedItems]
    );

    const handleChange = useCallback(
        (item: any) => {
            let newSelectedItems = selectedItems.includes(item)
                ? [...selectedItems]
                : [...selectedItems, item];
            setFilterValue('');
            input.onChange(newSelectedItems.map(getSuggestionValue));
        },
        [getSuggestionValue, input, selectedItems]
    );

    const handleDelete = useCallback(
        event => {
            const newSelectedItems = [...selectedItems];
            const value = event.target.getAttribute('data-item');
            const item = choices.find(
                choice => getSuggestionValue(choice) == value // eslint-disable-line eqeqeq
            );
            newSelectedItems.splice(newSelectedItems.indexOf(item), 1);
            input.onChange(newSelectedItems.map(getSuggestionValue));
        },
        [choices, getSuggestionValue, input, selectedItems]
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

    const getSuggestions = useCallback(
        getSuggestionsFactory({
            choices,
            allowEmpty: false, // We do not want to insert an empty choice
            optionText,
            optionValue,
            limitChoicesToValue,
            getSuggestionText,
            selectedItem: selectedItems,
            suggestionLimit,
        }),
        [
            choices,
            optionText,
            optionValue,
            limitChoicesToValue,
            getSuggestionText,
            input,
            suggestionLimit,
        ]
    );

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
        [handleFilterChange, input]
    );

    const handleFocus = useCallback(
        openMenu => event => {
            openMenu(event);
            input.onFocus(event);
        },
        [input]
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
            itemToString={item => getSuggestionValue(item)}
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
                    onBlur,
                    onChange,
                    onFocus,
                    ref,
                    ...inputProps
                } = getInputProps({
                    onBlur: handleBlur,
                    onFocus: handleFocus(openMenu),
                    onKeyDown: handleKeyDown,
                });
                return (
                    <div className={classes.container}>
                        <TextField
                            fullWidth
                            InputProps={{
                                id,
                                name: id,
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
                                        })}
                                    >
                                        {selectedItems.map((item, index) => (
                                            <Chip
                                                key={index}
                                                tabIndex={-1}
                                                label={getSuggestionText(item)}
                                                className={classes.chip}
                                                onDelete={handleDelete}
                                                data-item={getSuggestionValue(
                                                    item
                                                )}
                                            />
                                        ))}
                                    </div>
                                ),
                                onBlur,
                                onChange: event => {
                                    handleFilterChange(event);
                                    onChange!(event as React.ChangeEvent<
                                        HTMLInputElement
                                    >);
                                },
                                onFocus,
                            }}
                            label={
                                <FieldTitle
                                    {...labelProps}
                                    source={source}
                                    resource={resource}
                                    isRequired={isRequired}
                                />
                            }
                            InputLabelProps={getLabelProps({
                                htmlFor: id,
                            })}
                            helperText={
                                (touched && error) || helperText ? (
                                    <InputHelperText
                                        touched={touched}
                                        error={error}
                                        helperText={helperText}
                                    />
                                ) : null
                            }
                            variant={variant}
                            margin={margin}
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
                                        key={getSuggestionValue(suggestion)}
                                        suggestion={suggestion}
                                        index={index}
                                        highlightedIndex={highlightedIndex}
                                        isSelected={selectedItems
                                            .map(getSuggestionValue)
                                            .includes(
                                                getSuggestionValue(suggestion)
                                            )}
                                        inputValue={filterValue}
                                        getSuggestionText={getSuggestionText}
                                        component={suggestionComponent}
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

const useStyles = makeStyles(theme => {
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
});

export default AutocompleteArrayInput;
