import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormControlLabel, FormHelperText } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import compose from 'recompose/compose';
import { addField, translate } from 'ra-core';

import Labeled from './Labeled';
import sanitizeRestProps from './sanitizeRestProps';

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
 * <RadioButtonGroupInput source="author_id" choices={choices} optionText={optionRenderer} />
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
export class RadioButtonGroupInput extends Component {
    handleChange = (event, value) => {
        this.props.input.onChange(value);
    };

    renderRadioButton = choice => {
        const {
            optionText,
            optionValue,
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
                value={get(choice, optionValue)}
                control={<Radio />}
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
            className,
            label,
            resource,
            source,
            input,
            isRequired,
            choices,
            options,
            meta,
            ...rest
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The RadioButtonGroupInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }

        const { touched, error, helperText = false } = meta;

        return (
            <Labeled
                {...sanitizeRestProps(rest)}
                className={className}
                label={label}
                resource={resource}
                onChange={this.handleChange}
                source={source}
                isRequired={isRequired}
            >
                <RadioGroup
                    name={source}
                    defaultSelected={input.value}
                    value={input.value}
                    {...options}
                >
                    {choices.map(this.renderRadioButton)}
                </RadioGroup>
                {touched && error && <FormHelperText>{error}</FormHelperText>}
                {helperText && <FormHelperText>{helperText}</FormHelperText>}
            </Labeled>
        );
    }
}

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

export default compose(addField, translate)(RadioButtonGroupInput);
