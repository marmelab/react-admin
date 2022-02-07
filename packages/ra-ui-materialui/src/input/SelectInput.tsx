import * as React from 'react';
import { ReactElement, useCallback } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import { TextFieldProps } from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import {
    useInput,
    FieldTitle,
    useTranslate,
    ChoicesProps,
    useChoices,
    warning,
} from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import {
    ResettableTextField,
    ResettableTextFieldStyles,
} from './ResettableTextField';
import { InputHelperText } from './InputHelperText';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { Labeled } from './Labeled';
import { LinearProgress } from '../layout';
import {
    useSupportCreateSuggestion,
    SupportCreateSuggestionOptions,
} from './useSupportCreateSuggestion';

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
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectInput source="gender" choices={choices} optionText={<FullNameField />}/>
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
 * The object passed as `options` props is passed to the material-ui <Select> component
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
        choices = [],
        className,
        create,
        createLabel,
        createValue,
        defaultValue = '',
        disableValue,
        emptyText,
        emptyValue,
        format,
        helperText,
        isFetching,
        isLoading,
        label,
        margin = 'dense',
        onBlur,
        onChange,
        onCreate,
        optionText,
        optionValue,
        parse,
        resource,
        source,
        translateChoice,
        validate,
        ...rest
    } = props;
    const translate = useTranslate();

    warning(
        source === undefined,
        `If you're not wrapping the SelectInput inside a ReferenceInput, you must provide the source prop`
    );

    warning(
        choices === undefined,
        `If you're not wrapping the SelectInput inside a ReferenceInput, you must provide the choices prop`
    );

    const { getChoiceText, getChoiceValue, getDisableValue } = useChoices({
        optionText,
        optionValue,
        disableValue,
        translateChoice,
    });

    const {
        field,
        fieldState,
        id,
        isRequired,
        formState: { isSubmitted },
    } = useInput({
        defaultValue,
        format,
        parse,
        onBlur,
        onChange,
        resource,
        source,
        validate,
        ...rest,
    });

    const { error, invalid, isTouched } = fieldState;

    const renderEmptyItemOption = useCallback(() => {
        return React.isValidElement(emptyText)
            ? React.cloneElement(emptyText)
            : emptyText === ''
            ? ' ' // em space, forces the display of an empty line of normal height
            : translate(emptyText, { _: emptyText });
    }, [emptyText, translate]);

    const renderMenuItemOption = useCallback(choice => getChoiceText(choice), [
        getChoiceText,
    ]);

    const handleChange = useCallback(
        async (eventOrChoice: any) => {
            // We might receive an event from the mui component
            // In this case, it will be the choice id
            // eslint-disable-next-line eqeqeq
            if (eventOrChoice?.target?.value != undefined) {
                field.onChange(eventOrChoice.target.value);
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
    const finalChoices =
        create || onCreate ? [...choices, createItem] : choices;

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
                id={id}
                label={label}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
                fieldState={fieldState}
                field={field}
                margin={margin}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    return (
        <>
            <StyledResettableTextField
                id={id}
                {...field}
                onChange={handleChangeWithCreateSupport}
                select
                label={
                    label !== '' &&
                    label !== false && (
                        <FieldTitle
                            label={label}
                            source={source}
                            resource={resource}
                            isRequired={isRequired}
                        />
                    )
                }
                className={className}
                clearAlwaysVisible
                error={(isTouched || isSubmitted) && invalid}
                helperText={
                    <InputHelperText
                        touched={isTouched || isSubmitted}
                        error={error?.message}
                        helperText={helperText}
                    />
                }
                margin={margin}
                {...sanitizeRestProps(rest)}
            >
                <MenuItem
                    value={emptyValue}
                    key="null"
                    aria-label={translate('ra.action.clear_input_value')}
                    title={translate('ra.action.clear_input_value')}
                >
                    {renderEmptyItemOption()}
                </MenuItem>
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
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    disableValue: PropTypes.string,
    resettable: PropTypes.bool,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

SelectInput.defaultProps = {
    emptyText: '',
    emptyValue: '',
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
    disableValue: 'disabled',
};

const sanitizeRestProps = ({
    addLabel,
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
    sort,
    subscription,
    type,
    validateFields,
    validation,
    value,
    ...rest
}: any) => sanitizeInputRestProps(rest);

const PREFIX = 'RaSelectInput';

const StyledResettableTextField = styled(ResettableTextField, { name: PREFIX })(
    ({ theme }) => ({
        ...ResettableTextFieldStyles,
        minWidth: theme.spacing(20),
    })
);

export type SelectInputProps = Omit<CommonInputProps, 'source'> &
    ChoicesProps &
    Omit<SupportCreateSuggestionOptions, 'handleChange'> &
    Omit<TextFieldProps, 'label' | 'helperText' | 'classes'> & {
        disableValue?: string;
        emptyText?: string | ReactElement;
        emptyValue?: any;
        // Source is optional as AutocompleteInput can be used inside a ReferenceInput that already defines the source
        source?: string;
    };
