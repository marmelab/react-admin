import { FunctionComponent, memo } from 'react';

/**
 * A version of React.memo that preserves the original component type allowing it to accept generics.
 * See {@link https://stackoverflow.com/a/70890101}
 */
export const genericMemo: <T extends FunctionComponent>(component: T) => T = <
    T extends FunctionComponent
>(
    component: T
) => {
    const result = (memo(component) as unknown) as T;

    // We have to set the propTypes, defaultProps and displayName on both the field implementation and the memoized version.
    // On the implementation so that the memoized version can pick them up and users may reference the defaultProps in their components.
    // On the memoized version so that components that inspect their children props may read them.
    result.propTypes = component.propTypes;
    result.defaultProps = component.defaultProps;
    result.displayName = component.displayName?.replace('Impl', '');
    return result;
};
