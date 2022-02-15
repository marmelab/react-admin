import * as React from 'react';
import {
    isValidElement,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { styled } from '@mui/material/styles';
import {
    Autocomplete,
    AutocompleteProps,
    Chip,
    TextField,
    TextFieldProps,
} from '@mui/material';
import {
    ChoicesProps,
    FieldTitle,
    RaRecord,
    useChoicesContext,
    useInput,
    useSuggestions,
    UseSuggestionsOptions,
    useTimeout,
    useTranslate,
    warning,
} from 'ra-core';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';
import { CommonInputProps } from './CommonInputProps';
import { InputHelperText } from './InputHelperText';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';

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
 * `optionText` also accepts a React Element, that can access
 * the related choice through the `useRecordContext` hook. You can use Field components there.
 * Note that you must also specify the `matchSuggestion` and `inputText` props
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const matchSuggestion = (filterValue, choice) => choice.first_name.match(filterValue) || choice.last_name.match(filterValue)
 * const inputText = (record) => `${record.fullName} (${record.language})`;
 *
 * const FullNameField = () => {
 *     const record = useRecordContext();
 *     return <span>{record.first_name} {record.last_name}</span>;
 * }
 * <AutocompleteInput source="author" choices={choices} optionText={<FullNameField />} matchSuggestion={matchSuggestion} inputText={inputText} />
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
export const AutocompleteInput = <
    OptionType extends RaRecord = RaRecord,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    SupportCreate extends boolean | undefined = false
>(
    props: AutocompleteInputProps<
        OptionType,
        Multiple,
        DisableClearable,
        SupportCreate
    >
) => {
    const {
        choices: choicesProp,
        clearText = 'ra.action.clear_input_value',
        closeText = 'ra.action.close',
        className,
        create,
        createLabel,
        createItemLabel,
        createValue,
        debounce: debounceDelay = 250,
        defaultValue = '',
        emptyText,
        emptyValue = '',
        field: fieldOverride,
        format,
        helperText,
        id: idOverride,
        inputText,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        isRequired: isRequiredOverride,
        label,
        limitChoicesToValue,
        matchSuggestion,
        margin = 'dense',
        fieldState: fieldStateOverride,
        filterToQuery = DefaultFilterToQuery,
        formState: formStateOverride,
        multiple = false,
        noOptionsText,
        onBlur,
        onChange,
        onCreate,
        openText = 'ra.action.open',
        optionText = 'name',
        optionValue = 'id',
        parse,
        resource: resourceProp,
        shouldRenderSuggestions,
        setFilter,
        size = 'small',
        source: sourceProp,
        suggestionLimit,
        TextFieldProps,
        translateChoice,
        validate,
        variant = 'filled',
        ...rest
    } = props;

    const {
        allChoices,
        isLoading,
        resource,
        source,
        setFilters,
    } = useChoicesContext({
        choices: choicesProp,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        resource: resourceProp,
        source: sourceProp,
    });

    const translate = useTranslate();
    const {
        id,
        field,
        isRequired,
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
    } = useInput({
        defaultValue,
        format,
        id: idOverride,
        field: fieldOverride,
        fieldState: fieldStateOverride,
        formState: formStateOverride,
        onBlur,
        onChange,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const selectedChoice = useSelectedChoice<
        OptionType,
        Multiple,
        DisableClearable,
        SupportCreate
    >(field.value, {
        choices: allChoices,
        // @ts-ignore
        multiple,
        optionValue,
    });

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
            shouldRenderSuggestions != undefined && noOptionsText == undefined,
            `When providing a shouldRenderSuggestions function, we recommend you also provide the noOptionsText prop and set it to a text explaining users why no options are displayed. It supports translation keys.`
        );
        /* eslint-enable eqeqeq */
    }, [shouldRenderSuggestions, noOptionsText]);

    const { getChoiceText, getChoiceValue, getSuggestions } = useSuggestions({
        choices: allChoices,
        emptyText,
        emptyValue,
        limitChoicesToValue,
        matchSuggestion,
        optionText,
        optionValue,
        selectedItem: selectedChoice,
        suggestionLimit,
        translateChoice,
    });

    const [filterValue, setFilterValue] = useState('');

    const handleChange = (newValue: any) => {
        if (multiple) {
            if (Array.isArray(newValue)) {
                field.onChange(newValue.map(getChoiceValue));
            } else {
                field.onChange([
                    ...(field.value ?? []),
                    getChoiceValue(newValue),
                ]);
            }
        } else {
            field.onChange(getChoiceValue(newValue));
        }
    };

    // eslint-disable-next-line
    const debouncedSetFilter = useCallback(
        debounce(filter => {
            if (setFilter) {
                return setFilter(filter);
            }

            if (choicesProp) {
                return;
            }

            setFilters(filterToQuery(filter), undefined, true);
        }, debounceDelay),
        [debounceDelay, setFilters, setFilter]
    );

    // We must reset the filter every time the value changes to ensure we
    // display at least some choices even if the input has a value.
    // Otherwise, it would only display the currently selected one and the user
    // would have to first clear the input before seeing any other choices
    const currentValue = useRef(field.value);
    useEffect(() => {
        if (!isEqual(currentValue.current, field.value)) {
            currentValue.current = field.value;
            debouncedSetFilter('');
        }
    }, [field.value]); // eslint-disable-line

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

    const getOptionLabel = useCallback(
        (option: any) => {
            // eslint-disable-next-line eqeqeq
            if (option == undefined) {
                return '';
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
        },
        [getChoiceText, inputText]
    );

    useEffect(() => {
        if (!multiple) {
            setFilterValue(getOptionLabel(selectedChoice));
        }
    }, [getOptionLabel, multiple, selectedChoice]);

    const handleInputChange = (event: any, newInputValue: string) => {
        setFilterValue(newInputValue);
        debouncedSetFilter(newInputValue);
    };

    const doesQueryMatchSuggestion = useCallback(
        filter => {
            let selectedItemTexts = [];

            if (multiple) {
                selectedItemTexts = selectedChoice.map(item =>
                    getOptionLabel(item)
                );
            } else {
                selectedItemTexts = [getOptionLabel(selectedChoice)];
            }

            const hasOption = !!allChoices
                ? allChoices.some(choice => getOptionLabel(choice) === filter)
                : false;

            return selectedItemTexts.includes(filter) || hasOption;
        },
        [allChoices, getOptionLabel, multiple, selectedChoice]
    );

    const filterOptions = (options, params) => {
        const { inputValue } = params;
        if (
            (onCreate || create) &&
            inputValue !== '' &&
            !doesQueryMatchSuggestion(filterValue)
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
    const currentChoices = useRef(allChoices);
    useEffect(() => {
        if (allChoices && (allChoices.length > 0 || oneSecondHasPassed)) {
            currentChoices.current = allChoices;
        }
    }, [allChoices, oneSecondHasPassed]);

    const suggestions = useMemo(() => {
        if (setFilters && allChoices?.length === 0 && !oneSecondHasPassed) {
            return currentChoices.current;
        }
        return getSuggestions(filterValue);
    }, [
        allChoices,
        filterValue,
        getSuggestions,
        oneSecondHasPassed,
        setFilters,
    ]);

    const isOptionEqualToValue = (option, value) => {
        // eslint-disable-next-line eqeqeq
        return getChoiceValue(option) == getChoiceValue(value);
    };

    return (
        <Root className={className}>
            <Autocomplete
                blurOnSelect
                clearText={translate(clearText, { _: clearText })}
                closeText={translate(closeText, { _: closeText })}
                openOnFocus
                openText={translate(openText, { _: openText })}
                id={id}
                isOptionEqualToValue={isOptionEqualToValue}
                filterSelectedOptions
                renderInput={params => (
                    <TextField
                        name={field.name}
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
                        error={(isTouched || isSubmitted) && invalid}
                        helperText={
                            <InputHelperText
                                touched={isTouched || isSubmitted}
                                error={error?.message}
                                helperText={helperText}
                            />
                        }
                        margin={margin}
                        variant={variant}
                        className={AutocompleteClasses.input}
                        {...TextFieldProps}
                        {...params}
                        size={size}
                    />
                )}
                multiple={multiple}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip
                            label={
                                isValidElement(optionText)
                                    ? inputText(option)
                                    : getChoiceText(option)
                            }
                            sx={{
                                '.MuiSvgIcon-root': {
                                    // FIXME: Workaround to allow choices deletion
                                    // Maybe related to storybook and mui using different versions of emotion
                                    zIndex: 100,
                                },
                            }}
                            size="small"
                            {...getTagProps({ index })}
                        />
                    ))
                }
                noOptionsText={
                    typeof noOptionsText === 'string'
                        ? translate(noOptionsText, { _: noOptionsText })
                        : noOptionsText
                }
                selectOnFocus
                clearOnBlur
                {...sanitizeInputRestProps(rest)}
                freeSolo={!!create || !!onCreate}
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
                    isLoading && suggestions.length === 0 && oneSecondHasPassed
                }
                value={selectedChoice}
                onChange={handleAutocompleteChange}
                onBlur={field.onBlur}
                onInputChange={handleInputChange}
                renderOption={(props, record) => (
                    <li {...props}>{getChoiceText(record)}</li>
                )}
            />
            {createElement}
        </Root>
    );
};

// @ts-ignore
export interface AutocompleteInputProps<
    OptionType extends any = RaRecord,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    SupportCreate extends boolean | undefined = false
> extends Omit<CommonInputProps, 'source'>,
        ChoicesProps,
        UseSuggestionsOptions,
        Omit<SupportCreateSuggestionOptions, 'handleChange' | 'optionText'>,
        Omit<
            AutocompleteProps<
                OptionType,
                Multiple,
                DisableClearable,
                SupportCreate
            >,
            'onChange' | 'options' | 'renderInput'
        > {
    debounce?: number;
    filterToQuery?: (searchText: string) => any;
    inputText?: (option: any) => string;
    setFilter?: (value: string) => void;
    shouldRenderSuggestions?: any;
    // Source is optional as AutocompleteInput can be used inside a ReferenceInput that already defines the source
    source?: string;
    TextFieldProps?: TextFieldProps;
}

const PREFIX = 'RaAutocompleteInput';

export const AutocompleteClasses = {
    input: `${PREFIX}-input`,
};

const Root = styled('span', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${AutocompleteClasses.input}`]: {
        minWidth: theme.spacing(20),
    },
}));

/**
 * Returns the selected choice (or choices if multiple) by matching the input value with the choices.
 */
const useSelectedChoice = <
    OptionType extends any = RaRecord,
    Multiple extends boolean | undefined = false,
    DisableClearable extends boolean | undefined = false,
    SupportCreate extends boolean | undefined = false
>(
    value: any,
    {
        choices,
        multiple,
        optionValue,
    }: AutocompleteInputProps<
        OptionType,
        Multiple,
        DisableClearable,
        SupportCreate
    >
) => {
    const selectedChoiceRef = useRef(
        getSelectedItems(choices, value, optionValue, multiple)
    );
    const [selectedChoice, setSelectedChoice] = useState<RaRecord | RaRecord[]>(
        () => getSelectedItems(choices, value, optionValue, multiple)
    );

    // As the selected choices are objects, we want to ensure we pass the same
    // reference to the Autocomplete as it would reset its filter value otherwise.
    useEffect(() => {
        const newSelectedItems = getSelectedItems(
            choices,
            value,
            optionValue,
            multiple
        );

        if (!isEqual(selectedChoiceRef.current, newSelectedItems)) {
            selectedChoiceRef.current = newSelectedItems;
            setSelectedChoice(newSelectedItems);
        }
    }, [choices, value, multiple, optionValue]);
    return selectedChoice || null;
};

const getSelectedItems = (
    choices = [],
    value,
    optionValue = 'id',
    multiple
) => {
    if (multiple) {
        return (value || [])
            .map(item =>
                choices.find(choice => item === get(choice, optionValue))
            )
            .filter(item => !!item);
    }
    return choices.find(choice => get(choice, optionValue) === value) || '';
};

const DefaultFilterToQuery = searchText => ({ q: searchText });
