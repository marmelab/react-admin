import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { initializeForm } from '../../actions';
import { required } from './validate';

const isRequired = validate => {
    if (validate === required) return true;
    if (Array.isArray(validate)) {
        return validate.includes(required);
    }
    return false;
};

export default BaseComponent => {
    class FormFieldComponent extends Component {
        componentDidMount() {
            const { defaultValue, initializeForm, source } = this.props;
            if (!defaultValue) {
                return;
            }
            initializeForm({
                [source]:
                    typeof defaultValue === 'function'
                        ? defaultValue()
                        : defaultValue,
            });
        }

        render() {
            const { validate, ...props } = this.props;
            return (
                <Field
                    {...props}
                    name={props.source}
                    component={BaseComponent}
                    isRequired={isRequired(validate)}
                />
            );
        }
    }

    FormFieldComponent.propTypes = {
        defaultValue: PropTypes.any,
        initializeForm: PropTypes.func.isRequired,
        source: PropTypes.string,
        validate: PropTypes.func,
    };

    return connect(undefined, { initializeForm })(FormFieldComponent);
};
