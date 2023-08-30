import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    FormControl,
    FormHelperText,
    FormLabel,
    RadioGroup,
} from '@mui/material';
import { RadioGroupProps } from '@mui/material/RadioGroup';
import { FormControlProps } from '@mui/material/FormControl';
import get from 'lodash/get';
import { useInput, FieldTitle, ChoicesProps, useChoicesContext } from 'ra-core';

import { CommonInputProps } from './CommonInputProps';
import { sanitizeInputRestProps } from './sanitizeInputRestProps';
import { InputHelperText } from './InputHelperText';
import { RadioButtonGroupInputItem } from './RadioButtonGroupInputItem';
import { Labeled } from '../Labeled';
import { LinearProgress } from '../layout';

/**
 * An Input component for a radio button group, using an array of objects for the options
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
 * <RadioButtonGroupInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <RadioButtonGroupInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={optionRenderer} />
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
 *     return (<span>{record.first_name} {record.last_name}</span>)
 * };
 * <RadioButtonGroupInput source="recipients" choices={choices} optionText={<FullNameField />}/>
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
 * <RadioButtonGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the Material UI <RadioButtonGroup> component
 */
export const RadioButtonGroupInput = (props: RadioButtonGroupInputProps) => {
    const {
        choices: choicesProp,
        className,
        format,
        helperText,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        label,
        margin = 'dense',
        onBlur,
        onChange,
        options = defaultOptions,
        optionText = 'name',
        optionValue = 'id',
        parse,
        resource: resourceProp,
        row = true,
        source: sourceProp,
        translateChoice,
        validate,
        ...rest
    } = props;

    const {
        allChoices,
        isLoading,
        error: fetchError,
        resource,
        source,
        isFromReference,
    } = useChoicesContext({
        choices: choicesProp,
        isFetching: isFetchingProp,
        isLoading: isLoadingProp,
        resource: resourceProp,
        source: sourceProp,
    });

    if (source === undefined) {
        throw new Error(
            `If you're not wrapping the RadioButtonGroupInput inside a ReferenceArrayInput, you must provide the source prop`
        );
    }

    if (!isLoading && !fetchError && allChoices === undefined) {
        throw new Error(
            `If you're not wrapping the RadioButtonGroupInput inside a ReferenceArrayInput, you must provide the choices prop`
        );
    }

    const { id, isRequired, fieldState, field, formState } = useInput({
        format,
        onBlur,
        onChange,
        parse,
        resource,
        source,
        validate,
        ...rest,
    });

    const { error, invalid, isTouched } = fieldState;
    const { isSubmitted } = formState;

    if (isLoading) {
        return (
            <Labeled
                htmlFor={id}
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

    const renderHelperText =
        !!fetchError ||
        helperText !== false ||
        ((isTouched || isSubmitted) && invalid);

    return (
        <StyledFormControl
            component="fieldset"
            className={clsx('ra-input', `ra-input-${source}`, className)}
            margin={margin}
            error={fetchError || ((isTouched || isSubmitted) && invalid)}
            {...sanitizeRestProps(rest)}
        >
            <FormLabel
                component="legend"
                className={RadioButtonGroupInputClasses.label}
            >
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </FormLabel>

            <RadioGroup
                id={id}
                row={row}
                {...field}
                {...options}
                {...sanitizeRestProps(rest)}
            >
                {allChoices?.map(choice => (
                    <RadioButtonGroupInputItem
                        key={get(choice, optionValue)}
                        choice={choice}
                        optionText={optionText}
                        optionValue={optionValue}
                        source={id}
                        translateChoice={translateChoice ?? !isFromReference}
                    />
                ))}
            </RadioGroup>
            {renderHelperText ? (
                <FormHelperText>
                    <InputHelperText
                        touched={isTouched || isSubmitted || fetchError}
                        error={error?.message || fetchError?.message}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </StyledFormControl>
    );
};

RadioButtonGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.any),
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.element,
    ]),
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]),
    optionValue: PropTypes.string,
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

export type RadioButtonGroupInputProps = Omit<CommonInputProps, 'source'> &
    ChoicesProps &
    FormControlProps &
    RadioGroupProps & {
        options?: RadioGroupProps;
        source?: string;
    };

const PREFIX = 'RaRadioButtonGroupInput';

export const RadioButtonGroupInputClasses = {
    label: `${PREFIX}-label`,
};

const StyledFormControl = styled(FormControl, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${RadioButtonGroupInputClasses.label}`]: {
        transform: 'translate(0, 5px) scale(0.75)',
        transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'}`,
    },
}));

const defaultOptions = {};
