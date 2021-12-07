import * as React from 'react';
import {
    cloneElement,
    isValidElement,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import get from 'lodash/get';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import {
    ChoicesInputProps,
    FieldTitle,
    Record,
    UseChoicesOptions,
    useInput,
    useSuggestions,
    useTimeout,
    useTranslate,
    warning,
} from 'ra-core';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';
import { InputHelperText } from './InputHelperText';

export const AutocompleteInput = (props: AutocompleteInputProps) => {
    const {
        allowEmpty,
        choices,
        create,
        createLabel,
        createItemLabel,
        createValue,
        emptyText,
        emptyValue,
        format,
        helperText,
        id: idOverride,
        input: inputOverride,
        inputText,
        isRequired: isRequiredOverride,
        label,
        loaded,
        loading,
        limitChoicesToValue,
        matchSuggestion,
        meta: metaOverride,
        onBlur,
        onChange,
        onCreate,
        onFocus,
        options,
        optionText = 'name',
        optionValue = 'id',
        parse,
        resource,
        setFilter,
        shouldRenderSuggestions,
        source,
        suggestionLimit,
        translateChoice,
        validate,
        ...rest
    } = props;

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

    const selectedItem = useMemo(
        () =>
            choices?.find(choice => get(choice, optionValue) === input.value) ||
            null,
        [choices, input.value, optionValue]
    );

    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        if (isValidElement(optionText) && inputText == undefined) {
            throw new Error(`
If you provided a React element for the optionText prop, you must also provide the inputText prop (used for the text input)`);
        }
        // eslint-disable-next-line eqeqeq
        if (isValidElement(optionText) && matchSuggestion == undefined) {
            throw new Error(`
If you provided a React element for the optionText prop, you must also provide the matchSuggestion prop (used to match the user input with a choice)`);
        }
    }, [optionText, inputText, matchSuggestion]);

    useEffect(() => {
        warning(
            /* eslint-disable eqeqeq */
            shouldRenderSuggestions != undefined &&
                options?.noOptionsText == undefined,
            `When providing a shouldRenderSuggestions function, we recommend you also provide the noOptionsText through the options prop and set it to a text explaining users why no options are displayed.`
        );
        /* eslint-enable eqeqeq */
    }, [shouldRenderSuggestions, options]);

    const { getChoiceText, getChoiceValue, getSuggestions } = useSuggestions({
        // AutocompleteInput allows duplicate so that we ensure the selected item is always in the choices
        allowDuplicates: true,
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

    const handleChange = (choice: any) => {
        input.onChange(getChoiceValue(choice));
    };

    const [filterValue, setFilterValue] = useState('');

    // We must reset the filter every time the value changes to ensure we
    // display at least some choices even if the input has a value.
    // Otherwise, it would only display the currently selected one and the user
    // would have to first clear the input before seeing any other choices
    const currentValue = useRef(input.value);
    useEffect(() => {
        if (currentValue.current !== input.value) {
            currentValue.current = input.value;
            if (setFilter) {
                setFilter('');
            }
        }
    }, [input.value]); // eslint-disable-line

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

    const getOptionLabel = (option: any) => {
        // eslint-disable-next-line eqeqeq
        if (option == undefined) {
            return null;
        }
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }

        // eslint-disable-next-line eqeqeq
        if (inputText != undefined) {
            return inputText(option);
        }

        return getChoiceText(option);
    };

    const isOptionEqualToValue = (option, value) => {
        return getChoiceValue(option) === getChoiceValue(value);
    };

    const handleInputChange = (event: any, newInputValue: string) => {
        setFilterValue(newInputValue);

        if (setFilter && newInputValue !== getChoiceText(selectedItem)) {
            setFilter(newInputValue);
        }
    };

    const doesQueryMatchSuggestion = useMemo(() => {
        if (isValidElement(optionText)) {
            return choices.some(choice => matchSuggestion(filterValue, choice));
        }

        const isFunction = typeof optionText === 'function';

        if (isFunction) {
            const hasOption = choices.some(choice => {
                const text = optionText(choice) as string;

                return get(choice, text) === filterValue;
            });

            const selectedItemText = optionText(selectedItem);

            return hasOption || selectedItemText === filterValue;
        }

        const selectedItemText = get(selectedItem, optionText);
        const hasOption = !!choices
            ? choices.some(choice => {
                  return get(choice, optionText) === filterValue;
              })
            : false;

        return selectedItemText === filterValue || hasOption;
    }, [choices, optionText, filterValue, matchSuggestion, selectedItem]);

    const filterOptions = (options, params) => {
        const { inputValue } = params;
        if (
            (onCreate || create) &&
            inputValue !== '' &&
            !doesQueryMatchSuggestion
        ) {
            return options.concat(getCreateItem(inputValue));
        }

        return options;
    };

    const handleAutocompleteChange = (event: any, newValue) => {
        handleChangeWithCreateSupport(newValue);
    };

    const oneSecondHasPassed = useTimeout(1000, filterValue);

    // To avoid displaying an empty list of choices while a search is in progress,
    // we store the last choices in a ref. We'll display those last choices until
    // a second has passed.
    const currentChoices = useRef(choices);
    useEffect(() => {
        if (choices && (choices.length > 0 || oneSecondHasPassed)) {
            currentChoices.current = choices;
        }
    }, [choices, oneSecondHasPassed]);

    const suggestions = useMemo(() => {
        if (setFilter && choices?.length === 0 && !oneSecondHasPassed) {
            return currentChoices.current;
        }
        return getSuggestions(filterValue);
    }, [choices, filterValue, getSuggestions, oneSecondHasPassed, setFilter]);

    return (
        <>
            <Autocomplete
                blurOnSelect
                clearText={translate('ra.action.clear_input_value')}
                closeText={translate('ra.action.close')}
                openOnFocus
                openText={translate('ra.action.open')}
                isOptionEqualToValue={isOptionEqualToValue}
                renderInput={params => (
                    <TextField
                        {...params}
                        id={id}
                        name={input.name}
                        label={
                            <FieldTitle
                                label={label}
                                source={source}
                                resource={resource}
                                isRequired={
                                    typeof isRequiredOverride !== 'undefined'
                                        ? isRequiredOverride
                                        : isRequired
                                }
                            />
                        }
                        error={!!(touched && (error || submitError))}
                        helperText={
                            <InputHelperText
                                touched={touched}
                                error={error || submitError}
                                helperText={helperText}
                            />
                        }
                    />
                )}
                {...options}
                freeSolo={!!create || !!onCreate}
                selectOnFocus={!!create || !!onCreate}
                clearOnBlur={!!create || !!onCreate}
                handleHomeEndKeys={!!create || !!onCreate}
                filterOptions={filterOptions}
                options={
                    shouldRenderSuggestions == undefined || // eslint-disable-line eqeqeq
                    shouldRenderSuggestions(filterValue)
                        ? suggestions
                        : []
                }
                getOptionLabel={getOptionLabel}
                inputValue={filterValue}
                loading={
                    loading && suggestions.length === 0 && oneSecondHasPassed
                }
                value={selectedItem}
                onChange={handleAutocompleteChange}
                onBlur={input.onBlur}
                onFocus={input.onFocus}
                onInputChange={handleInputChange}
                renderOption={(props, record) => {
                    if (isValidElement(optionText)) {
                        return cloneElement(optionText, {
                            record: record as Record,
                            ...props,
                        });
                    }

                    return <li {...props}>{getChoiceText(record)}</li>;
                }}
            />
            {createElement}
        </>
    );
};

export interface AutocompleteInputProps
    extends ChoicesInputProps<AutocompleteProps<any, false, false, false>>,
        UseChoicesOptions,
        Omit<SupportCreateSuggestionOptions, 'handleChange' | 'optionText'> {}
