import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    useMemo,
    isValidElement,
} from 'react';
import Downshift, { DownshiftProps } from 'downshift';
import get from 'lodash/get';
import classNames from 'classnames';
import {
    TextField,
    InputAdornment,
    IconButton,
    InputProps,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ClearIcon from '@material-ui/icons/Clear';
import { TextFieldProps } from '@material-ui/core/TextField';
import {
    useInput,
    FieldTitle,
    ChoicesInputProps,
    UseChoicesOptions,
    mergeRefs,
    useSuggestions,
    useTranslate,
    warning,
} from 'ra-core';

import InputHelperText from './InputHelperText';
import AutocompleteSuggestionList from './AutocompleteSuggestionList';
import AutocompleteSuggestionItem from './AutocompleteSuggestionItem';
import { AutocompleteInputLoader } from './AutocompleteInputLoader';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';

/**
 * An Input component for an autocomplete field, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property as the option text
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
export const AutocompleteInput = (props: AutocompleteInputProps) => {
    const {
        allowEmpty,
        className,
        classes: classesOverride,
        clearAlwaysVisible,
        choices = [],
        createLabel,
        createItemLabel,
        createValue,
        create,
        disabled,
        emptyText,
        emptyValue,
        format,
        fullWidth,
        helperText,
        id: idOverride,
        input: inputOverride,
        inputText,
        isRequired: isRequiredOverride,
        label,
        limitChoicesToValue,
        loaded,
        loading,
        margin = 'dense',
        matchSuggestion,
        meta: metaOverride,
        onBlur,
        onChange,
        onCreate,
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
        optionValue = 'id',
        parse,
        refetch,
        resettable,
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

    warning(
        source === undefined,
        `If you're not wrapping the AutocompleteInput inside a ReferenceInput, you must provide the source prop`
    );

    warning(
        choices === undefined,
        `If you're not wrapping the AutocompleteInput inside a ReferenceInput, you must provide the choices prop`
    );

    const classes = useStyles(props);
    const inputEl = useRef<HTMLInputElement>();
    const anchorEl = useRef<any>();
    const translate = useTranslate();

    const {
        id,
        input,
        isRequired,
        meta: { touched, error, submitError },
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

    const doesQueryMatchSuggestion = useMemo(() => {
        if (isValidElement(optionText)) {
            return choices.some(choice => matchSuggestion(filterValue, choice));
        }

        const isFunction = typeof optionText === 'function';

        if (isFunction) {
            const selectedItemText = optionText(selectedItem);

            if (isValidElement(selectedItemText) && !inputText) {
                throw new Error(
                    'When optionText returns a React element, you must also provide the inputText prop'
                );
            }

            const hasOption = choices.some(choice => {
                const text = optionText(choice) as string;

                return get(choice, text) === filterValue;
            });

            return hasOption || selectedItemText === filterValue;
        }

        const selectedItemText = get(selectedItem, optionText);
        const hasOption = choices.some(choice => {
            return get(choice, optionText) === filterValue;
        });

        return selectedItemText === filterValue || hasOption;
    }, [
        optionText,
        selectedItem,
        choices,
        filterValue,
        matchSuggestion,
        inputText,
    ]);

    const shouldAllowCreate = !doesQueryMatchSuggestion;

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

    const handleChange = useCallback(
        async (item: any, newItem: any) => {
            const value = getChoiceValue(newItem || item);
            if (value == null && filterValue) {
                setFilterValue('');
            }

            input.onChange(value);
        },
        [filterValue, getChoiceValue, input]
    );

    const {
        getCreateItem,
        handleChange: handleChangeWithCreateSupport,
        createElement,
    } = useSupportCreateSuggestion({
        create,
        createLabel,
        createItemLabel,
        createValue,
        handleChange,
        filter: filterValue,
        onCreate,
        optionText,
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
            typeof input.value === 'undefined' ||
                input.value === null ||
                selectedItem === null
                ? ''
                : inputText
                ? /* @ts-ignore */ inputText(
                      getChoiceText(selectedItem).props.record
                  )
                : getChoiceText(selectedItem)
        );
    }, [
        input.value,
        handleFilterChange,
        selectedItem,
        getChoiceText,
        inputText,
    ]);

    useEffect(() => {
        inputEl.current.blur();
    }, [input.value]);

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
                        ? /* @ts-ignore */ inputText(
                              getChoiceText(selectedItem).props.record
                          )
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

    const { endAdornment, inputRef, ...InputPropsWithoutEndAdornment } =
        InputProps || {};

    const handleClickClearButton = useCallback(
        openMenu => event => {
            event.stopPropagation();
            setFilterValue('');
            input.onChange('');
            openMenu(event);
            input.onFocus(event);
        },
        [input]
    );

    const getEndAdornment = openMenu => {
        if (!resettable) {
            if (endAdornment) {
                return endAdornment;
            }
            if (loading) {
                return <AutocompleteInputLoader />;
            }
        } else if (!filterValue) {
            const label = translate('ra.action.clear_input_value');
            if (clearAlwaysVisible) {
                // show clear button, inactive
                return (
                    <InputAdornment position="end">
                        <IconButton
                            className={classes.clearButton}
                            aria-label={label}
                            title={label}
                            disableRipple
                            disabled={true}
                        >
                            <ClearIcon
                                className={classNames(
                                    classes.clearIcon,
                                    classes.visibleClearIcon
                                )}
                            />
                        </IconButton>
                        {loading && <AutocompleteInputLoader />}
                    </InputAdornment>
                );
            } else {
                if (endAdornment) {
                    return endAdornment;
                } else {
                    // show spacer
                    return (
                        <InputAdornment position="end">
                            <span className={classes.clearButton}>&nbsp;</span>
                            {loading && <AutocompleteInputLoader />}
                        </InputAdornment>
                    );
                }
            }
        } else {
            // show clear
            const label = translate('ra.action.clear_input_value');
            return (
                <InputAdornment position="end">
                    <IconButton
                        className={classes.clearButton}
                        aria-label={label}
                        title={label}
                        disableRipple
                        onClick={handleClickClearButton(openMenu)}
                        onMouseDown={handleMouseDownClearButton}
                        disabled={disabled}
                    >
                        <ClearIcon
                            className={classNames(classes.clearIcon, {
                                [classes.visibleClearIcon]:
                                    clearAlwaysVisible || filterValue,
                            })}
                        />
                    </IconButton>
                    {loading && <AutocompleteInputLoader />}
                </InputAdornment>
            );
        }
    };

    return (
        <>
            <Downshift
                inputValue={filterValue}
                onChange={handleChangeWithCreateSupport}
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
                        classes: inputPropsClasses,
                        ...inputProps
                    } = getInputProps({
                        onBlur: handleBlur,
                        onFocus: handleFocus(openMenu),
                        ...InputProps,
                    });
                    const suggestions = [
                        ...getSuggestions(filterValue),
                        ...((onCreate || create) && shouldAllowCreate
                            ? [getCreateItem()]
                            : []),
                    ];
                    return (
                        <div className={classes.container}>
                            <TextField
                                id={id}
                                name={input.name}
                                InputProps={{
                                    inputRef: mergeRefs([
                                        storeInputRef,
                                        inputRef,
                                    ]),
                                    endAdornment: getEndAdornment(openMenu),
                                    onBlur,
                                    onChange: event => {
                                        setFilterValue(event.target.value);
                                        handleFilterChange(event);
                                        onChange!(
                                            event as React.ChangeEvent<
                                                HTMLInputElement
                                            >
                                        );
                                    },
                                    onFocus,
                                    ...InputPropsWithoutEndAdornment,
                                }}
                                error={!!(touched && (error || submitError))}
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
                                        error={error || submitError}
                                        helperText={helperText}
                                    />
                                }
                                disabled={disabled}
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
                                className={classes.suggestionsContainer}
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
                                        createValue={createValue}
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
            {createElement}
        </>
    );
};

const handleMouseDownClearButton = event => {
    event.preventDefault();
};

const useStyles = makeStyles(
    theme => ({
        container: {
            flexGrow: 1,
            position: 'relative',
        },
        clearIcon: {
            height: 16,
            width: 0,
        },
        visibleClearIcon: {
            width: 16,
        },
        clearButton: {
            height: 24,
            width: 24,
            padding: 0,
        },
        selectAdornment: {
            position: 'absolute',
            right: 24,
        },
        inputAdornedEnd: {
            paddingRight: 0,
        },
        suggestionsContainer: {
            zIndex: theme.zIndex.modal,
        },
    }),
    { name: 'RaAutocompleteInput' }
);

interface Options {
    InputProps?: InputProps;
    labelProps?: any;
    suggestionsContainerProps?: any;
}

export interface AutocompleteInputProps
    extends ChoicesInputProps<TextFieldProps>,
        UseChoicesOptions,
        Omit<SupportCreateSuggestionOptions, 'handleChange' | 'optionText'>,
        Omit<DownshiftProps<any>, 'onChange'> {
    clearAlwaysVisible?: boolean;
    resettable?: boolean;
    loaded?: boolean;
    loading?: boolean;
    options?: Options;
}
