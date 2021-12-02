import * as React from 'react';
import { isValidElement, useCallback, useMemo, useState } from 'react';
import get from 'lodash/get';
import { Autocomplete, AutocompleteProps, TextField } from '@mui/material';
import {
    useInput,
    FieldTitle,
    ChoicesInputProps,
    UseChoicesOptions,
    useSuggestions,
    useTranslate,
    warning,
} from 'ra-core';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';

export const MuiAutocompleteInput = (props: MuiAutocompleteInputProps) => {
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
        id: idOverride,
        input: inputOverride,
        isRequired: isRequiredOverride,
        label,
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
        if (option === null) {
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
                filterOptions={filterOptions}
                freeSolo={!!create || !!onCreate}
                selectOnFocus={!!create || !!onCreate}
                clearOnBlur={!!create || !!onCreate}
                handleHomeEndKeys={!!create || !!onCreate}
                id={id}
                inputValue={filterValue}
                getOptionLabel={getOptionLabel}
                isOptionEqualToValue={isOptionEqualToValue}
                onChange={handleAutocompleteChange}
                onInputChange={handleInputChange}
                options={suggestions}
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
                    />
                )}
                value={selectedItem}
            />
            {createElement}
        </>
    );
};

export interface MuiAutocompleteInputProps
    extends ChoicesInputProps<AutocompleteProps<any, false, false, false>>,
        UseChoicesOptions,
        Omit<SupportCreateSuggestionOptions, 'handleChange' | 'optionText'> {}
