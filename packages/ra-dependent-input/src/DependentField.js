import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import set from 'lodash/set';
import { FormField } from 'react-admin';
import getValue from './getValue';

export const DependentFieldComponent = ({
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

DependentFieldComponent.propTypes = {
    children: PropTypes.node.isRequired,
    dependsOn: PropTypes.any,
    record: PropTypes.object,
    resolve: PropTypes.func,
    show: PropTypes.bool.isRequired,
    value: PropTypes.any,
};

export const mapStateToProps = (
    state,
    { record, resolve, dependsOn, value }
) => {
    if (resolve && (dependsOn === null || typeof dependsOn === 'undefined')) {
        return { show: resolve(record, dependsOn, value) };
    }

    if (resolve && !Array.isArray(dependsOn)) {
        return { show: resolve(getValue(record, dependsOn)) };
    }

    if (resolve && Array.isArray(dependsOn)) {
        const obj = dependsOn.reduce((acc, path) => {
            const value = get(record, path);
            return set(acc, path, value);
        }, {});
        return { show: resolve(obj) };
    }

    if (Array.isArray(dependsOn) && Array.isArray(value)) {
        return {
            show: dependsOn.reduce(
                (acc, s, index) => acc && getValue(record, s) === value[index],
                true
            ),
        };
    }

    if (typeof value === 'undefined') {
        if (Array.isArray(dependsOn)) {
            return {
                show: dependsOn.reduce(
                    (acc, s) => acc && !!getValue(record, s),
                    true
                ),
            };
        }

        return { show: !!getValue(record, dependsOn) };
    }

    return { show: getValue(record, dependsOn) === value };
};

export default connect(mapStateToProps)(DependentFieldComponent);
