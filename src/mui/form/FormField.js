import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field } from 'redux-form';

import { initializeForm as initializeFormAction } from '../../actions';
import Labeled from '../input/Labeled';
import isRequired from './isRequired';

export class FormFieldComponent extends Component {
    componentDidMount() {
        if (this.props.input.props.defaultValue) {
            let defaultValue = this.props.input.props.defaultValue;

            if (typeof defaultValue === 'function') {
                defaultValue = this.props.input.props.defaultValue();
            }

            this.props.initializeForm({
                [this.props.input.props.source]: defaultValue,
            });
        }
    }

    render() {
        const { input, ...rest } = this.props;

        if (input.props.addField) {
            if (input.props.addLabel) {
                return (
                    <Field
                        {...rest}
                        {...input.props}
                        name={input.props.source}
                        component={Labeled}
                        label={input.props.label}
                        isRequired={isRequired(input.props.validate)}
                    >
                        {input}
                    </Field>
                );
            }
            return (
                <Field
                    {...rest}
                    {...input.props}
                    name={input.props.source}
                    component={input.type}
                    isRequired={isRequired(input.props.validate)}
                />
            );
        }
        if (input.props.addLabel) {
            return (
                <Labeled
                    {...rest}
                    label={input.props.label}
                    source={input.props.source}
                    isRequired={isRequired(input.props.validate)}
                >
                    {input}
                </Labeled>
            );
        }
        return typeof input.type === 'string'
            ? input
            : React.cloneElement(input, rest);
    }
}

const FormField = connect(undefined, { initializeForm: initializeFormAction })(
    FormFieldComponent
);

FormField.displayName = 'FormField';

export default FormField;
