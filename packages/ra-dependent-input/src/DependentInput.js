import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form';
import get from 'lodash/get';
import { FormField } from 'react-admin';
import getValue from './getValue';

const REDUX_FORM_NAME = 'record-form';

export const DependentInputComponent = ({
    children,
    show,
    dependsOn,
    value,
    resolve,
    ...props
}) => {
    if (!show) {
        return null;
    }

    if (Array.isArray(children)) {
        return (
            <div>
                {React.Children.map(children, child => (
                    <div
                        key={child.props.source}
                        style={child.props.style}
                        className={`ra-input-${child.props.source}`}
                    >
                        <FormField input={child} {...props} />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            key={children.props.source}
            style={children.props.style}
            className={`ra-input-${children.props.source}`}
        >
            <FormField input={children} {...props} />
        </div>
    );
};

DependentInputComponent.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool.isRequired,
    dependsOn: PropTypes.any,
    value: PropTypes.any,
    resolve: PropTypes.func,
    formName: PropTypes.string,
};

export const mapStateToProps = (
    state,
    { resolve, dependsOn, value, formName = REDUX_FORM_NAME }
) => {
    if (resolve && (dependsOn === null || typeof dependsOn === 'undefined')) {
        const values = getFormValues(formName)(state);
        return {
            dependsOnValue: values,
            show: resolve(values, dependsOn, value),
        };
    }

    let formValue;
    // get the current form values from redux-form
    if (Array.isArray(dependsOn)) {
        // We have to destructure the array here as redux-form does not accept an array of fields
        formValue = formValueSelector(formName)(state, ...dependsOn);
    } else {
        formValue = formValueSelector(formName)(state, dependsOn);
    }

    if (resolve) {
        return {
            dependsOnValue: formValue,
            show: resolve(formValue, dependsOn),
        };
    }

    if (Array.isArray(dependsOn) && Array.isArray(value)) {
        return {
            dependsOnValue: formValue,
            show: dependsOn.reduce(
                (acc, s, index) => acc && get(formValue, s) === value[index],
                true
            ),
        };
    }

    if (typeof value === 'undefined') {
        if (Array.isArray(dependsOn)) {
            return {
                dependsOnValue: formValue,
                show: dependsOn.reduce(
                    (acc, s) => acc && !!getValue(formValue, s),
                    true
                ),
            };
        }

        return { dependsOnValue: formValue, show: !!formValue };
    }

    return { dependsOnValue: formValue, show: formValue === value };
};

export default connect(mapStateToProps)(DependentInputComponent);
