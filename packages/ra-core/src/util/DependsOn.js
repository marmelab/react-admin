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
    source,
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
    source: PropTypes.any,
    value: PropTypes.any,
    resolve: PropTypes.func,
    formName: PropTypes.string,
};

export const mapStateToProps = (
    state,
    { source, formName = REDUX_FORM_NAME, record, resolve, value }
) => {
    const formValues = getFormValues(formName)(state);
    const data = formValues || record;

    if (resolve && (source === null || typeof source === 'undefined')) {
        return {
            dependsOnValue: data,
            show: resolve(data, source, value),
        };
    }

    let dependsOnValue;
    // get the current form values from redux-form
    if (Array.isArray(source)) {
        dependsOnValue = source.reduce(
            (acc, dependsOnKey) =>
                set(acc, dependsOnKey, get(data, dependsOnKey)),
            {}
        );
    } else {
        dependsOnValue = get(data, source);
    }

    if (resolve) {
        return {
            dependsOnValue,
            show: resolve(dependsOnValue, source),
        };
    }

    if (Array.isArray(source) && Array.isArray(value)) {
        return {
            dependsOnValue,
            show: source.reduce(
                (acc, s, index) =>
                    acc && get(dependsOnValue, s) === value[index],
                true
            ),
        };
    }

    if (typeof value === 'undefined') {
        if (Array.isArray(source)) {
            return {
                dependsOnValue,
                show: source.reduce(
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
