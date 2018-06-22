import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { initializeForm } from '../actions/formActions';

export const isRequired = validate => {
    if (validate && validate.isRequired) return true;
    if (Array.isArray(validate)) {
        return !!validate.find(it => it.isRequired);
    }
    return false;
};

export class FormField extends Component {
    static propTypes = {
        component: PropTypes.any.isRequired,
        defaultValue: PropTypes.any,
        initializeForm: PropTypes.func.isRequired,
        input: PropTypes.object,
        source: PropTypes.string,
        validate: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
    };

    componentDidMount() {
        const { defaultValue, input, initializeForm, source } = this.props;
        if (typeof defaultValue === 'undefined' || input) {
            return;
        }
        initializeForm({
            [source]:
                typeof defaultValue === 'function'
                    ? defaultValue()
                    : defaultValue,
        });
    }

    componentWillReceiveProps(nextProps) {
        const { defaultValue, input, initializeForm, source } = nextProps;
        if (typeof defaultValue === 'undefined' || input) {
            return;
        }

        if (defaultValue !== this.props.defaultValue) {
            initializeForm({
                [source]:
                    typeof defaultValue === 'function'
                        ? defaultValue()
                        : defaultValue,
            });
        }
    }

    render() {
        const { input, validate, component, ...props } = this.props;
        return input ? ( // An ancestor is already decorated by Field
            React.createElement(component, this.props)
        ) : (
            <Field
                {...props}
                name={props.source}
                component={component}
                validate={validate}
                isRequired={isRequired(validate)}
            />
        );
    }
}

export default connect(undefined, { initializeForm })(FormField);
