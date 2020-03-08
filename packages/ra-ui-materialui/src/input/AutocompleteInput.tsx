import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    FunctionComponent,
    useMemo,
    isValidElement,
} from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import get from 'lodash/get';
import { makeStyles, TextField } from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import {
    useInput,
    FieldTitle,
    InputProps,
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
 * <AutocompleteInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <AutocompleteInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <AutocompleteInput source="author_id" choices={choices} optionText={optionRenderer} />
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
 * <AutocompleteInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <TextField> component
 *
 * @example
 * <AutocompleteInput source="author_id" options={{ color: 'secondary', InputLabelProps: { shrink: true } }} />
 */
const AutocompleteInput: FunctionComponent<
    InputProps<TextFieldProps & Options> & DownshiftProps<any>
> = ({
    allowEmpty,
    className,
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
    } = {
        suggestionsContainerProps: undefined,
        labelProps: undefined,
        InputProps: undefined,
    },
    optionText = 'name',
    inputText,
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
}) => {
    if (isValidElement(optionText) && !inputText) {
        throw new Error(`If the optionText prop is a React element, you must also specify the inputText prop:
        <AutocompleteInput
            inputText={(record) => record.title}
        />`);
    }

    warning(
        isValidElement(optionText) && !matchSuggestion,
        `If the optionText prop is a React element, you must also specify the matchSuggestion prop:
<AutocompleteInput
    matchSuggestion={(filterValue, suggestion) => true}
/>
        `
    );

    const classes = useStyles({ classes: classesOverride });

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

    const [filterValue, setFilterValue] = useState('');

    const getSuggestionFromValue = useCallback(
        value => choices.find(choice => get(choice, optionValue) === value),
        [choices, optionValue]
    );

    const selectedItem = useMemo(
        () => getSuggestionFromValue(input.value) || null,
        [input.value, getSuggestionFromValue]
    );

    const { getChoiceText, getChoiceValue, getSuggestions } = useSuggestions({
        allowEmpty,
        choices,
        emptyText,
        emptyValue,
        limitChoicesToValue,
        matchSuggestion,
        optionText,
        optionValue,
        selectedItem,
        suggestionLimit,
        translateChoice,
    });

    const handleFilterChange = useCallback(
        (eventOrValue: React.ChangeEvent<{ value: string }> | string) => {
            const event = eventOrValue as React.ChangeEvent<{ value: string }>;
            const value = event.target
                ? event.target.value
                : (eventOrValue as string);

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

        // If we have a value, set the filter to its text so that
        // Downshift displays it correctly
        setFilterValue(
            input.value
                ? inputText
                    ? inputText(getChoiceText(selectedItem).props.record)
                    : getChoiceText(selectedItem)
                : ''
        );
    }, [
        input.value,
        handleFilterChange,
        selectedItem,
        getChoiceText,
        inputText,
    ]);

    const handleChange = useCallback(
        (item: any) => {
            input.onChange(getChoiceValue(item));
        },
        [getChoiceValue, input]
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
            handleFilterChange('');
            // If we had a value before, set the filter back to its text so that
            // Downshift displays it correctly
            setFilterValue(
                input.value
                    ? inputText
                        ? inputText(getChoiceText(selectedItem).props.record)
                        : getChoiceText(selectedItem)
                    : ''
            );
            input.onBlur(event);
        },
        [getChoiceText, handleFilterChange, input, inputText, selectedItem]
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
            selectedItem={selectedItem}
            itemToString={item => getChoiceValue(item)}
            {...rest}
        >
            {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                highlightedIndex,
                openMenu,
            }) => {
                const isMenuOpen =
                    isOpen && shouldRenderSuggestions(filterValue);
                const {
                    id: downshiftId, // We want to ignore this to correctly link our label and the input
                    value,
                    onBlur,
                    onChange,
                    onFocus,
                    ref,
                    size,
                    color,
                    ...inputProps
                } = getInputProps({
                    onBlur: handleBlur,
                    onFocus: handleFocus(openMenu),
                    ...InputProps,
                });
                const suggestions = getSuggestions(filterValue);

                return (
                    <div className={classes.container}>
                        <TextField
                            id={id}
                            name={input.name}
                            InputProps={{
                                inputRef: storeInputRef,
                                onBlur,
                                onChange: event => {
                                    handleFilterChange(event);
                                    setFilterValue(event.target.value);
                                    onChange!(event as React.ChangeEvent<
                                        HTMLInputElement
                                    >);
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
                            fullWidth={fullWidth}
                            value={filterValue}
                            className={className}
                            size={size as any}
                            color={color as any}
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
                            {suggestions.map((suggestion, index) => (
                                <AutocompleteSuggestionItem
                                    key={getChoiceValue(suggestion)}
                                    suggestion={suggestion}
                                    index={index}
                                    highlightedIndex={highlightedIndex}
                                    isSelected={
                                        input.value ===
                                        getChoiceValue(suggestion)
                                    }
                                    filterValue={filterValue}
                                    getSuggestionText={getChoiceText}
                                    {...getItemProps({
                                        item: suggestion,
                                    })}
                                />
                            ))}
                        </AutocompleteSuggestionList>
                    </div>
                );
            }}
        </Downshift>
    );
};

const useStyles = makeStyles(
    {
        root: {
            flexGrow: 1,
            height: 250,
        },
        container: {
            flexGrow: 1,
            position: 'relative',
        },
    },
    { name: 'RaAutocompleteInput' }
);

export default AutocompleteInput;
