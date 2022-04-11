import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Select,
    MenuItem,
    InputLabel,
    FormHelperText,
    FormControl,
    Chip,
} from '@mui/material';
import {
    ChoicesProps,
    FieldTitle,
    useInput,
    useChoicesContext,
    useChoices,
} from 'ra-core';
import { InputHelperText } from './InputHelperText';
import { FormControlProps } from '@mui/material/FormControl';

import { LinearProgress } from '../layout';
import { CommonInputProps } from './CommonInputProps';
import { Labeled } from '../Labeled';
import {
    SupportCreateSuggestionOptions,
    useSupportCreateSuggestion,
} from './useSupportCreateSuggestion';

/**
 * An Input component for a select box allowing multiple selections, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property as the option text
 * @example
 * const choices = [
 *    { id: 'programming', name: 'Programming' },
 *    { id: 'lifestyle', name: 'Lifestyle' },
 *    { id: 'photography', name: 'Photography' },
 * ];
 * <SelectArrayInput source="tags" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectArrayInput source="authors" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectArrayInput source="authors" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that can access
 * the related choice through the `useRecordContext` hook. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectArrayInput source="authors" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.tags.programming' },
 *    { id: 'lifestyle', name: 'myroot.tags.lifestyle' },
 *    { id: 'photography', name: 'myroot.tags.photography' },
 * ];
 */
export const SelectArrayInput = (props: SelectArrayInputProps) => {
    const {
        choices: choicesProp,
        className,
        create,
        createLabel,
        createValue,
        disableValue,
        format,
        helperText,
        label,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        margin = 'dense',
        onBlur,
        onChange,
        onCreate,
        optionText,
        optionValue,
        parse,
        resource: resourceProp,
        source: sourceProp,
        translateChoice,
        validate,
        variant = 'filled',
        ...rest
    } = props;

    const inputLabel = useRef(null);

    const { allChoices, isLoading, source, resource } = useChoicesContext({
        choices: choicesProp,
        isLoading: isLoadingProp,
        isFetching: isFetchingProp,
        resource: resourceProp,
        source: sourceProp,
    });

    const { getChoiceText, getChoiceValue, getDisableValue } = useChoices({
        optionText,
        optionValue,
        disableValue,
        translateChoice,
    });

    const {
        field,
        isRequired,
        fieldState: { error, invalid, isTouched },
        formState: { isSubmitted },
    } = useInput({
        format,
        onBlur,
        onChange,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const handleChange = useCallback(
        (eventOrChoice: any) => {
            // We might receive an event from the mui component
            // In this case, it will be the choice id
            // eslint-disable-next-line eqeqeq
            if (eventOrChoice?.target?.value != undefined) {
                field.onChange(eventOrChoice);
            } else {
                // Or we might receive a choice directly, for instance a newly created one
                field.onChange([
                    ...(field.value || []),
                    getChoiceValue(eventOrChoice),
                ]);
            }
        },
        [field, getChoiceValue]
    );

    const {
        getCreateItem,
        handleChange: handleChangeWithCreateSupport,
        createElement,
    } = useSupportCreateSuggestion({
        create,
        createLabel,
        createValue,
        handleChange,
        onCreate,
        optionText,
    });

    const createItem = create || onCreate ? getCreateItem() : null;
    const finalChoices =
        create || onCreate
            ? [...(allChoices || []), createItem]
            : allChoices || [];

    const renderMenuItemOption = useCallback(
        choice =>
            !!createItem &&
            choice?.id === createItem.id &&
            typeof optionText === 'function'
                ? createItem.name
                : getChoiceText(choice),
        [createItem, getChoiceText, optionText]
    );

    const renderMenuItem = useCallback(
        choice => {
            return choice ? (
                <MenuItem
                    key={getChoiceValue(choice)}
                    value={getChoiceValue(choice)}
                    disabled={getDisableValue(choice)}
                >
                    {renderMenuItemOption(
                        !!createItem && choice?.id === createItem.id
                            ? createItem
                            : choice
                    )}
                </MenuItem>
            ) : null;
        },
        [getChoiceValue, getDisableValue, renderMenuItemOption, createItem]
    );

    if (isLoading) {
        return (
            <Labeled
                label={label}
                source={source}
                resource={resource}
                className={clsx('ra-input', `ra-input-${source}`, className)}
                isRequired={isRequired}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    return (
        <>
            <StyledFormControl
                margin={margin}
                className={clsx('ra-input', `ra-input-${source}`, className)}
                error={(isTouched || isSubmitted) && invalid}
                variant={variant}
                {...sanitizeRestProps(rest)}
            >
                <InputLabel
                    ref={inputLabel}
                    id={`${label}-outlined-label`}
                    error={(isTouched || isSubmitted) && invalid}
                >
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                </InputLabel>
                <Select
                    autoWidth
                    labelId={`${label}-outlined-label`}
                    multiple
                    error={(isTouched || isSubmitted) && invalid}
                    renderValue={(selected: any[]) => (
                        <div className={SelectArrayInputClasses.chips}>
                            {selected
                                .map(item =>
                                    (allChoices || []).find(
                                        choice =>
                                            getChoiceValue(choice) === item
                                    )
                                )
                                .filter(item => !!item)
                                .map(item => (
                                    <Chip
                                        key={getChoiceValue(item)}
                                        label={renderMenuItemOption(item)}
                                        className={SelectArrayInputClasses.chip}
                                        size="small"
                                    />
                                ))}
                        </div>
                    )}
                    data-testid="selectArray"
                    size="small"
                    {...field}
                    onChange={handleChangeWithCreateSupport}
                    value={field.value || []}
                >
                    {finalChoices.map(renderMenuItem)}
                </Select>
                <FormHelperText error={isTouched && !!error}>
                    <InputHelperText
                        touched={isTouched || isSubmitted}
                        error={error?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            </StyledFormControl>
            {createElement}
        </>
    );
};

export type SelectArrayInputProps = ChoicesProps &
    Omit<SupportCreateSuggestionOptions, 'handleChange'> &
    Omit<CommonInputProps, 'source'> &
    Omit<FormControlProps, 'defaultValue' | 'onBlur' | 'onChange'> & {
        disableValue?: string;
        source?: string;
    };

SelectArrayInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    disableValue: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

SelectArrayInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    disableValue: 'disabled',
    translateChoice: true,
};

const sanitizeRestProps = ({
    alwaysOn,
    choices,
    classNamInputWithOptionsPropse,
    componenInputWithOptionsPropst,
    crudGetMInputWithOptionsPropsatching,
    crudGetOInputWithOptionsPropsne,
    defaultValue,
    disableValue,
    emptyText,
    enableGetChoices,
    filter,
    filterToQuery,
    formClassName,
    initializeForm,
    initialValue,
    input,
    isRequired,
    label,
    limitChoicesToValue,
    loaded,
    locale,
    meta,
    onChange,
    options,
    optionValue,
    optionText,
    perPage,
    record,
    reference,
    resource,
    setFilter,
    setPagination,
    setSort,
    sort,
    source,
    textAlign,
    translate,
    translateChoice,
    validation,
    ...rest
}: any) => rest;

const PREFIX = 'RaSelectArrayInput';

export const SelectArrayInputClasses = {
    chips: `${PREFIX}-chips`,
    chip: `${PREFIX}-chip`,
};

const StyledFormControl = styled(FormControl, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    minWidth: theme.spacing(20),
    [`& .${SelectArrayInputClasses.chips}`]: {
        display: 'flex',
        flexWrap: 'wrap',
    },

    [`& .${SelectArrayInputClasses.chip}`]: {
        marginTop: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
    },
}));
