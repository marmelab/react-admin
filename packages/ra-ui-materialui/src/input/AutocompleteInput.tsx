import * as React from 'react';
import {
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import get from 'lodash/get';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import {
    useInput,
    FieldTitle,
    ChoicesInputProps,
    UseChoicesOptions,
    useSuggestions,
    useTranslate,
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
        isRequired: isRequiredOverride,
        label,
        loaded,
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

    const getSuggestionFromValue = useCallback(
        value => choices.find(choice => get(choice, optionValue) === value),
        [choices, optionValue]
    );

    const selectedItem = useMemo(
        () => getSuggestionFromValue(input.value) || null,
        [input.value, getSuggestionFromValue]
    );

    useEffect(() => {
        if (isValidElement(optionText)) {
            throw new Error(`
AutocompleteInput does not accept an element for the optionText prop.
Please provide an optionText that returns a string (used for the text input) and use the renderOption prop to customize how options are rendered.`);
        }
    }, [optionText]);

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

    const handleChange = (choice: any) => {
        input.onChange(getChoiceValue(choice));
    };

    const [filterValue, setFilterValue] = useState('');

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
        return getChoiceText(option);
    };

    const isOptionEqualToValue = (option, value) => {
        return getChoiceValue(option) === getChoiceValue(value);
    };

    const handleInputChange = (event: any, newInputValue: string) => {
        setFilterValue(newInputValue);
    };

    const suggestions = useMemo(() => getSuggestions(filterValue), [
        filterValue,
        getSuggestions,
    ]);

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
        const hasOption = choices.some(choice => {
            return get(choice, optionText) === filterValue;
        });

        return selectedItemText === filterValue || hasOption;
    }, [choices, optionText, filterValue, matchSuggestion, selectedItem]);

    const filterOptions = (options, params) => {
        const { inputValue } = params;
        if (
            (onCreate || create) &&
            inputValue !== '' &&
            !doesQueryMatchSuggestion
        ) {
            return options.concat(getCreateItem());
        }

        return options;
    };

    const handleAutocompleteChange = (event: any, newValue) => {
        handleChangeWithCreateSupport(newValue);
    };

    return (
        <>
            <Autocomplete
                clearText={translate('ra.action.clear_input_value')}
                closeText={translate('ra.action.close')}
                freeSolo={!!create || !!onCreate}
                selectOnFocus={!!create || !!onCreate}
                clearOnBlur={!!create || !!onCreate}
                handleHomeEndKeys={!!create || !!onCreate}
                openText={translate('ra.action.open')}
                options={suggestions}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={isOptionEqualToValue}
                renderInput={params => (
                    <TextField
                        {...params}
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
                filterOptions={filterOptions}
                id={id}
                inputValue={filterValue}
                loading={!loaded}
                value={selectedItem}
                onChange={handleAutocompleteChange}
                onInputChange={handleInputChange}
            />
            {createElement}
        </>
    );
};

export interface AutocompleteInputProps
    extends ChoicesInputProps<AutocompleteProps<any, false, false, false>>,
        UseChoicesOptions,
        Omit<SupportCreateSuggestionOptions, 'handleChange' | 'optionText'> {}
