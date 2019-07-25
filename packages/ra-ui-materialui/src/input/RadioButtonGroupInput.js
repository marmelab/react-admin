import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core/styles';
import { addField, FieldTitle, useTranslate } from 'ra-core';
import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';

const useStyles = makeStyles({
    label: {
        position: 'relative',
    },
});

/**
 * An Input component for a radio button group, using an array of objects for the options
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
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <RadioButtonGroupInput source="gender" choices={choices} optionText={<FullNameField />}/>
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
 * The object passed as `options` props is passed to the material-ui <RadioButtonGroup> component
 */
export const RadioButtonGroupInput = ({
    className,
    label,
    resource,
    source,
    input,
    isRequired,
    choices,
    options,
    meta,
    helperText,
    optionText,
    optionValue,
    translateChoice,
    ...rest
}) => {
    const classes = useStyles();
    const translate = useTranslate();

    const handleChange = useCallback(
        (event, value) => {
            input.onChange(value);
        },
        [input]
    );

    const renderRadioButton = useCallback(
        choice => {
            const choiceName = React.isValidElement(optionText) // eslint-disable-line no-nested-ternary
                ? React.cloneElement(optionText, { record: choice })
                : typeof optionText === 'function'
                ? optionText(choice)
                : get(choice, optionText);

            const nodeId = `${source}_${get(choice, optionValue)}`;

            return (
                <FormControlLabel
                    htmlFor={nodeId}
                    key={get(choice, optionValue)}
                    value={get(choice, optionValue)}
                    control={<Radio id={nodeId} color="primary" />}
                    label={
                        translateChoice
                            ? translate(choiceName, { _: choiceName })
                            : choiceName
                    }
                />
            );
        },
        [optionText, optionValue, source, translate, translateChoice]
    );

    if (typeof meta === 'undefined') {
        throw new Error(
            "The RadioButtonGroupInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
        );
    }

    const { touched, error } = meta;

    return (
        <FormControl
            component="fieldset"
            className={className}
            margin="normal"
            {...sanitizeRestProps(rest)}
        >
            <InputLabel component="legend" shrink className={classes.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>

            <RadioGroup
                name={source}
                value={input.value}
                onChange={handleChange}
                {...options}
            >
                {choices.map(renderRadioButton)}
            </RadioGroup>
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

RadioButtonGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
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
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
    meta: PropTypes.object,
};

RadioButtonGroupInput.defaultProps = {
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default addField()(RadioButtonGroupInput);
