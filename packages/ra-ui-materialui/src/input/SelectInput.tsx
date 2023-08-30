import * as React from 'react';
import { ReactElement, useCallback, useEffect, ChangeEvent } from 'react';
import { isElement } from 'react-is';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { MenuItem, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    useChoicesContext,
    useInput,
    FieldTitle,
    useTranslate,
    ChoicesProps,
    useChoices,
    RaRecord,
    useGetRecordRepresentation,
} from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import {
    ResettableTextField,
    ResettableTextFieldStyles,
} from './ResettableTextField';
import { InputHelperText } from './InputHelperText';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import {
    useSupportCreateSuggestion,
    SupportCreateSuggestionOptions,
} from './useSupportCreateSuggestion';
import { LoadingInput } from './LoadingInput';

/**
 * An Input component for a select box, using an array of objects for the options
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
 * <SelectInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that can access
 * the related choice through the `useRecordContext` hook. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = () => {
 *     const record = useRecordContext();
 *     return <span>{record.first_name} {record.last_name}</span>;
 * }
 * <SelectInput source="author" choices={choices} optionText={<FullNameField />}/>
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
 * <SelectInput source="gender" choices={choices} translateChoice={false}/>
 *
 * You can disable some choices by providing a `disableValue` field which name is `disabled` by default
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 *    { id: 976, first_name: 'William', last_name: 'Rinkerd', disabled: true },
 * ];
 *
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 *    { id: 976, first_name: 'William', last_name: 'Rinkerd', not_available: true },
 * ];
 * <SelectInput source="gender" choices={choices} disableValue="not_available" />
 *
 */
export const SelectInput = (props: SelectInputProps) => {
    const {
        choices: choicesProp,
        className,
        create,
        createLabel,
        createValue,
        defaultValue,
        disableValue = 'disabled',
        emptyText = '',
        emptyValue = '',
        format,
        filter,
        helperText,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        label,
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
        ...rest
    } = props;
    const translate = useTranslate();

    useEffect(() => {
        // eslint-disable-next-line eqeqeq
        if (emptyValue == null) {
            throw new Error(
                `emptyValue being set to null or undefined is not supported. Use parse to turn the empty string into null.`
            );
        }
    }, [emptyValue]);

    const {
        allChoices,
        isLoading,
        error: fetchError,
        source,
        resource,
        isFromReference,
    } = useChoicesContext({
        choices: choicesProp,
        isLoading: isLoadingProp,
        isFetching: isFetchingProp,
        resource: resourceProp,
        source: sourceProp,
    });

    if (source === undefined) {
        throw new Error(
            `If you're not wrapping the SelectInput inside a ReferenceInput, you must provide the source prop`
        );
    }

    if (!isLoading && !fetchError && allChoices === undefined) {
        throw new Error(
            `If you're not wrapping the SelectInput inside a ReferenceInput, you must provide the choices prop`
        );
    }

    const getRecordRepresentation = useGetRecordRepresentation(resource);
    const { getChoiceText, getChoiceValue, getDisableValue } = useChoices({
        optionText:
            optionText ??
            (isFromReference ? getRecordRepresentation : undefined),
        optionValue,
        disableValue,
        translateChoice: translateChoice ?? !isFromReference,
    });
    const {
        field,
        fieldState,
        id,
        isRequired,
        formState: { isSubmitted },
    } = useInput({
        defaultValue,
        parse,
        format,
        onBlur,
        onChange,
        resource,
        source,
        validate,
        ...rest,
    });

    const { error, invalid, isTouched } = fieldState;

    const renderEmptyItemOption = useCallback(() => {
        return isElement(emptyText)
            ? emptyText
            : emptyText === ''
            ? ' ' // em space, forces the display of an empty line of normal height
            : translate(emptyText, { _: emptyText });
    }, [emptyText, translate]);

    const renderMenuItemOption = useCallback(choice => getChoiceText(choice), [
        getChoiceText,
    ]);

    const handleChange = useCallback(
        async (eventOrChoice: ChangeEvent<HTMLInputElement> | RaRecord) => {
            // We might receive an event from the mui component
            // In this case, it will be the choice id
            if (eventOrChoice?.target) {
                field.onChange(eventOrChoice);
            } else {
                // Or we might receive a choice directly, for instance a newly created one
                field.onChange(getChoiceValue(eventOrChoice));
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
    let finalChoices = allChoices;
    if (create || onCreate) {
        finalChoices = [...finalChoices, createItem];
    }

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
            <LoadingInput
                label={
                    label !== '' &&
                    label !== false && (
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resourceProp}
                            isRequired={isRequired}
                        />
                    )
                }
                sx={props.sx}
                helperText={
                    <InputHelperText
                        touched={isTouched || isSubmitted}
                        error={error?.message}
                        helperText={helperText}
                    />
                }
                variant={props.variant}
                size={props.size}
                margin={props.margin}
                fullWidth={props.fullWidth}
            />
        );
    }

    const renderHelperText =
        !!fetchError ||
        helperText !== false ||
        ((isTouched || isSubmitted) && invalid);

    return (
        <>
            <StyledResettableTextField
                id={id}
                {...field}
                className={clsx('ra-input', `ra-input-${source}`, className)}
                onChange={handleChangeWithCreateSupport}
                select
                label={
                    label !== '' &&
                    label !== false && (
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resourceProp}
                            isRequired={isRequired}
                        />
                    )
                }
                clearAlwaysVisible
                error={!!fetchError || ((isTouched || isSubmitted) && invalid)}
                helperText={
                    renderHelperText ? (
                        <InputHelperText
                            touched={isTouched || isSubmitted || fetchError}
                            error={error?.message || fetchError?.message}
                            helperText={helperText}
                        />
                    ) : null
                }
                margin={margin}
                {...sanitizeRestProps(rest)}
            >
                {!isRequired && (
                    <MenuItem
                        value={emptyValue}
                        key="null"
                        aria-label={translate('ra.action.clear_input_value')}
                        title={translate('ra.action.clear_input_value')}
                    >
                        {renderEmptyItemOption()}
                    </MenuItem>
                )}
                {finalChoices.map(renderMenuItem)}
            </StyledResettableTextField>
            {createElement}
        </>
    );
};

SelectInput.propTypes = {
    emptyText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    emptyValue: PropTypes.any,
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]),
    optionValue: PropTypes.string,
    disableValue: PropTypes.string,
    resettable: PropTypes.bool,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

const sanitizeRestProps = ({
    afterSubmit,
    allowNull,
    beforeSubmit,
    choices,
    className,
    crudGetMatching,
    crudGetOne,
    data,
    field,
    fieldState,
    formState,
    filter,
    filterToQuery,
    formatOnBlur,
    isEqual,
    limitChoicesToValue,
    multiple,
    name,
    pagination,
    perPage,
    ref,
    reference,
    refetch,
    render,
    setFilter,
    setPagination,
    setSort,
    shouldUnregister,
    sort,
    subscription,
    type,
    validateFields,
    validation,
    value,
    ...rest
}: any) => sanitizeInputRestProps(rest);

const PREFIX = 'RaSelectInput';

const StyledResettableTextField = styled(ResettableTextField, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    ...ResettableTextFieldStyles,
    minWidth: theme.spacing(20),
    '& .MuiFilledInput-root': { paddingRight: 0 },
}));

export type SelectInputProps = Omit<CommonInputProps, 'source'> &
    ChoicesProps &
    Omit<SupportCreateSuggestionOptions, 'handleChange'> &
    Omit<TextFieldProps, 'label' | 'helperText' | 'classes' | 'onChange'> & {
        disableValue?: string;
        emptyText?: string | ReactElement;
        emptyValue?: any;
        resettable?: boolean;
        // Source is optional as AutocompleteInput can be used inside a ReferenceInput that already defines the source
        source?: string;
        onChange?: (event: ChangeEvent<HTMLInputElement> | RaRecord) => void;
    };
