import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
    makeStyles,
    Select,
    MenuItem,
    InputLabel,
    Input,
    FormHelperText,
    FormControl,
    Chip,
} from '@material-ui/core';
import classnames from 'classnames';
import { FieldTitle, useInput, useTranslate } from 'ra-core';
import InputHelperText from './InputHelperText';

const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
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
    limitChoicesToValue,
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
}) => rest;

const useStyles = makeStyles(theme => ({
    root: {},
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing(1 / 4),
    },
    select: {
        height: 'auto',
        overflow: 'auto',
    },
}));

/**
 * An Input component for a select box allowing multiple selections, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
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
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
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
const SelectArrayInput = ({
    choices,
    classes: classesOverride,
    className,
    label,
    helperText,
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
    const classes = useStyles({ classes: classesOverride });

    const translate = useTranslate();

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

    const handleChange = useCallback(
        event => {
            input.onChange(event.target.value);
            // HACK: For some reason, redux-form does not consider this input touched without calling onBlur manually
            input.onBlur(event.target.value);
        },
        [input]
    );

    const renderMenuItemOption = useCallback(
        choice => {
            if (React.isValidElement(optionText)) {
                return React.cloneElement(optionText, {
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

    const renderMenuItem = useCallback(
        choice => {
            return choice ? (
                <MenuItem
                    key={get(choice, optionValue)}
                    value={get(choice, optionValue)}
                >
                    {renderMenuItemOption(choice)}
                </MenuItem>
            ) : null;
        },
        [optionValue, renderMenuItemOption]
    );

    return (
        <FormControl
            margin="normal"
            className={classnames(classes.root, className)}
            error={touched && !!error}
            {...sanitizeRestProps(rest)}
        >
            <InputLabel htmlFor={id}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <Select
                autoWidth
                multiple
                input={<Input id={id} />}
                value={input.value || []}
                error={!!(touched && error)}
                renderValue={selected => (
                    <div className={classes.chips}>
                        {selected
                            .map(item =>
                                choices.find(
                                    choice => get(choice, optionValue) === item
                                )
                            )
                            .map(item => (
                                <Chip
                                    key={get(item, optionValue)}
                                    label={renderMenuItemOption(item)}
                                    className={classes.chip}
                                />
                            ))}
                    </div>
                )}
                data-testid="selectArray"
                {...options}
                onChange={handleChange}
            >
                {choices.map(renderMenuItem)}
            </Select>
            {helperText || (touched && error) ? (
                <FormHelperText>
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </FormControl>
    );
};

SelectArrayInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    translateChoice: PropTypes.bool,
};

SelectArrayInput.defaultProps = {
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default SelectArrayInput;
