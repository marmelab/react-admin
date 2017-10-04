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
    class FormField extends Component {
        static propTypes = {
            defaultValue: PropTypes.any,
            initializeForm: PropTypes.func.isRequired,
            input: PropTypes.object,
            source: PropTypes.string,
            validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
        };

        componentDidMount() {
            const { defaultValue, input, initializeForm, source } = this.props;
            if (!defaultValue || input) {
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
            const { input, validate, ...props } = this.props;
            return input ? ( // An ancestor is already decorated by Field
                <BaseComponent {...this.props} />
            ) : (
                <Field
                    {...props}
                    name={props.source}
                    component={BaseComponent}
                    isRequired={isRequired(validate)}
                />
            );
        }
    }

    return connect(undefined, { initializeForm })(FormField);
};
