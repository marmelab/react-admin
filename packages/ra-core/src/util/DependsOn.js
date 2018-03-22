import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import get from 'lodash/get';
import set from 'lodash/set';
import { FormField } from 'react-admin';
import getValue from './getValue';

const REDUX_FORM_NAME = 'record-form';

export const DependsOnView = ({
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

DependsOnView.propTypes = {
    children: PropTypes.node.isRequired,
    show: PropTypes.bool.isRequired,
    dependsOn: PropTypes.any,
    value: PropTypes.any,
    resolve: PropTypes.func,
    formName: PropTypes.string,
};

export const mapStateToProps = (
    state,
    { dependsOn, formName = REDUX_FORM_NAME, record, resolve, value }
) => {
    const formValues = getFormValues(formName)(state);
    const data = formValues || record;

    if (resolve && (dependsOn === null || typeof dependsOn === 'undefined')) {
        return {
            dependsOnValue: data,
            show: resolve(data, dependsOn, value),
        };
    }

    let dependsOnValue;
    // get the current form values from redux-form
    if (Array.isArray(dependsOn)) {
        dependsOnValue = dependsOn.reduce(
            (acc, dependsOnKey) =>
                set(acc, dependsOnKey, get(data, dependsOnKey)),
            {}
        );
    } else {
        dependsOnValue = get(data, dependsOn);
    }

    if (resolve) {
        return {
            dependsOnValue,
            show: resolve(dependsOnValue, dependsOn),
        };
    }

    if (Array.isArray(dependsOn) && Array.isArray(value)) {
        return {
            dependsOnValue,
            show: dependsOn.reduce(
                (acc, s, index) =>
                    acc && get(dependsOnValue, s) === value[index],
                true
            ),
        };
    }

    if (typeof value === 'undefined') {
        if (Array.isArray(dependsOn)) {
            return {
                dependsOnValue,
                show: dependsOn.reduce(
                    (acc, s) => acc && !!getValue(dependsOnValue, s),
                    true
                ),
            };
        }

        return { dependsOnValue: dependsOnValue, show: !!dependsOnValue };
    }

    return { dependsOnValue: dependsOnValue, show: dependsOnValue === value };
};

export default connect(mapStateToProps)(DependsOnView);
