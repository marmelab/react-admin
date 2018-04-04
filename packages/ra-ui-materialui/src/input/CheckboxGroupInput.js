import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import { addField, translate, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

const styles = theme => ({
    root: {},
    label: {
        transform: 'translate(0, 5px) scale(0.75)',
        transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'}`,
    },
});

/**
 * An Input component for a checkbox group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * The expected input must be an array of identifiers (e.g. [12, 31]) which correspond to
 * the 'optionValue' of 'choices' attribute objects.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *     { id: 12, name: 'Ray Hakt' },
 *     { id: 31, name: 'Ann Gullar' },
 *     { id: 42, name: 'Sean Phonee' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi' },
 *    { _id: 456, full_name: 'Jane Austen' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} optionText="full_name" optionValue="_id" />
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
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.category.programming' },
 *    { id: 'lifestyle', name: 'myroot.category.lifestyle' },
 *    { id: 'photography', name: 'myroot.category.photography' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <CheckboxGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <Checkbox> components
 */
export class CheckboxGroupInput extends Component {
    handleCheck = (event, isChecked) => {
        const { input: { value, onChange } } = this.props;
        const newValue = JSON.parse(event.target.value);
        if (isChecked) {
            onChange([...value, ...[newValue]]);
        } else {
            onChange(value.filter(v => v != newValue));
        }
    };

    renderCheckbox = choice => {
        const {
            input: { value },
            optionText,
            optionValue,
            options,
            translate,
            translateChoice,
        } = this.props;
        const choiceName = React.isValidElement(optionText) // eslint-disable-line no-nested-ternary
            ? React.cloneElement(optionText, { record: choice })
            : typeof optionText === 'function'
              ? optionText(choice)
              : get(choice, optionText);
        return (
            <FormControlLabel
                key={get(choice, optionValue)}
                checked={
                    value
                        ? value.find(v => v == get(choice, optionValue)) !==
                          undefined
                        : false
                }
                onChange={this.handleCheck}
                value={String(get(choice, optionValue))}
                control={<Checkbox {...options} />}
                label={
                    translateChoice
                        ? translate(choiceName, { _: choiceName })
                        : choiceName
                }
            />
        );
    };

    render() {
        const {
            choices,
            className,
            classes = {},
            isRequired,
            label,
            meta,
            resource,
            source,
            input,
            ...rest
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The CheckboxGroupInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }

        const { touched, error, helperText = false } = meta;

        return (
            <FormControl
                className={className}
                component="fieldset"
                margin="normal"
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
                <FormGroup row>{choices.map(this.renderCheckbox)}</FormGroup>
                {touched && error && <FormHelperText>{error}</FormHelperText>}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </FormControl>
        );
    }
}

CheckboxGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
    input: PropTypes.shape({
        onChange: PropTypes.func.isRequired,
    }),
    isRequired: PropTypes.bool,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
    meta: PropTypes.object,
};

CheckboxGroupInput.defaultProps = {
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

const EnhancedCheckboxGroupInput = compose(
    addField,
    translate,
    withStyles(styles)
)(CheckboxGroupInput);

EnhancedCheckboxGroupInput.defaultProps = {
    fullWidth: true,
};

export default EnhancedCheckboxGroupInput;
