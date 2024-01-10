import * as React from 'react';
import { ComponentType } from 'react';

const checkMinimumRequiredProps = (
    displayName: string,
    requiredProps: string[]
) => (WrappedComponent: ComponentType) => (props: any) => {
    useCheckMinimumRequiredProps(displayName, requiredProps, props);
    return <WrappedComponent {...props} />;
};

export default checkMinimumRequiredProps;

// Not a hook but named that way to avoid conflicts with the old one
export const useCheckMinimumRequiredProps = (
    displayName: string,
    requiredProps: string[],
    props: any
): void => {
    const propNames = Object.keys(props);
    const missingProps = requiredProps.filter(
        prop => !propNames.includes(prop)
    );

    if (missingProps.length > 0) {
        throw new Error(
            `<${displayName}> component is not properly configured, some essential props are missing.
Be sure to pass the props from the parent. Example:

const My${displayName} = props => (
    <${displayName} {...props}></${displayName}>
);

The missing props are: ${missingProps.join(', ')}`
        );
    }
};
