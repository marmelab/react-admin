import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import {
    makeStyles,
    FormControl,
    FormHelperText,
    FormLabel,
    RadioGroup,
} from '@material-ui/core';
import { RadioGroupProps } from '@material-ui/core/RadioGroup';
import { FormControlProps } from '@material-ui/core/FormControl';
import get from 'lodash/get';
import { useInput, FieldTitle, InputProps, ChoicesProps } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';
import InputHelperText from './InputHelperText';
import RadioButtonGroupInputItem from './RadioButtonGroupInputItem';

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
export const RadioButtonGroupInput: FunctionComponent<
    ChoicesProps & InputProps<RadioGroupProps> & FormControlProps
> = ({
    choices = [],
    classes: classesOverride,
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
    const classes = useStyles(classesOverride);

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

    return (
        <FormControl
            component="fieldset"
            margin="normal"
            error={touched && !!error}
            {...sanitizeRestProps(rest)}
        >
            <FormLabel component="legend" className={classes.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </FormLabel>

            <RadioGroup id={id} {...input} {...options}>
                {choices.map(choice => (
                    <RadioButtonGroupInputItem
                        key={get(choice, optionValue)}
                        choice={choice}
                        optionText={optionText}
                        optionValue={optionValue}
                        source={source}
                        translateChoice={translateChoice}
                    />
                ))}
            </RadioGroup>
            {(touched && error) || helperText ? (
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
    choices: PropTypes.arrayOf(PropTypes.any).isRequired,
    label: PropTypes.string,
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

RadioButtonGroupInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default RadioButtonGroupInput;
