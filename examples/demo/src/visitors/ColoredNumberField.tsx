import React, { ComponentType } from 'react';
import { NumberField } from 'react-admin';
import { FieldProps } from '../types';

const colored = <T extends FieldProps>(
    WrappedComponent: ComponentType<T>
): ComponentType<T> => {
    const Colored = (props: T) =>
        props.record && props.source ? (
            props.record[props.source] > 500 ? (
                <span style={{ color: 'red' }}>
                    <WrappedComponent {...props} />
                </span>
            ) : (
                <WrappedComponent {...props} />
            )
        ) : null;

    Colored.displayName = `Colored(${WrappedComponent.displayName})`;

    return Colored;
};

const ColoredNumberField = colored<typeof NumberField>(NumberField);
ColoredNumberField.defaultProps = NumberField.defaultProps;

export default ColoredNumberField;
