import React, { useCallback, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { useInput, FieldTitle, useTranslate, InputProps } from 'ra-core';

import ResettableTextField from './ResettableTextField';
import InputHelperText from './InputHelperText';
import { TextFieldProps } from '@material-ui/core/TextField';

const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
    emptyValue,
    basePath,
    choices,
    className,
    component,
    crudGetMatching,
    crudGetOne,
    defaultValue,
    filter,
    filterToQuery,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    locale,
    meta,
    onChange,
    options,
    optionValue,
    optionText,
    disableValue,
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

const useStyles = makeStyles(theme => ({
    input: {
        minWidth: theme.spacing(20),
    },
}));

/**
 * An Input component for a select box, using an array of objects for the options
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
const SelectInput: FunctionComponent<
    InputProps<TextFieldProps> & Omit<TextFieldProps, 'label' | 'helperText'>
> = ({
    allowEmpty,
    choices,
    className,
    disableValue,
    emptyText,
    emptyValue,
    helperText,
    label,
    onBlur,
    onChange,
    onFocus,
    options,
    optionText,
    optionValue,
    resource,
    source,
    translateChoice,
    validate,
    ...rest
}) => {
    const translate = useTranslate();
    const classes = useStyles({});

    const {
        id,
        input,
        isRequired,
        meta: { error, touched },
    } = useInput({
        onBlur,
        onChange,
        onFocus,
        resource,
        source,
        validate,
        ...rest,
    });

    const renderEmptyItemOption = useCallback(() => {
        return React.isValidElement(emptyText)
            ? React.cloneElement(emptyText)
            : translate(emptyText, { _: emptyText });
    }, [emptyText, translate]);

    const renderMenuItemOption = useCallback(
        choice => {
            if (React.isValidElement<{ record: any }>(optionText)) {
                return React.cloneElement<{ record: any }>(optionText, {
                    record: choice,
                });
            }

            const choiceName =
                typeof optionText === 'function'
                    ? optionText(choice)
                    : get(choice, optionText);

            return translateChoice
                ? translate(choiceName, { _: choiceName })
                : choiceName;
        },
        [optionText, translate, translateChoice]
    );

    return (
        <ResettableTextField
            id={id}
            {...input}
            select
            label={
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            }
            className={`${classes.input} ${className}`}
            clearAlwaysVisible
            error={!!(touched && error)}
            helperText={
                <InputHelperText
                    touched={touched}
                    error={error}
                    helperText={helperText}
                />
            }
            {...options}
            {...sanitizeRestProps(rest)}
        >
            {allowEmpty ? (
                <MenuItem value={emptyValue} key="null">
                    {renderEmptyItemOption()}
                </MenuItem>
            ) : null}
            {choices.map(choice => (
                <MenuItem
                    key={get(choice, optionValue)}
                    value={get(choice, optionValue)}
                    disabled={get(choice, disableValue)}
                >
                    {renderMenuItemOption(choice)}
                </MenuItem>
            ))}
        </ResettableTextField>
    );
};

SelectInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    emptyText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    emptyValue: PropTypes.any,
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
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

SelectInput.defaultProps = {
    allowEmpty: false,
    emptyText: '',
    emptyValue: '',
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
    disableValue: 'disabled',
};

export default SelectInput;
