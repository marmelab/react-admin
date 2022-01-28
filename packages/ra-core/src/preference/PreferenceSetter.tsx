import * as React from 'react';
import { useEffect, ReactNode } from 'react';
import { usePreferenceProvider } from './usePreferenceProvider';

/**
 * A component to set application preferences on mount declaratively
 *
 * To use it, just wrap any component that need to use the corresponding
 * preference with <PreferenceSetter name="my.preference" value="myvalue">.
 * This wrapping needs to be done to ensure that the corresponding preference
 * is set before rendering the wrapped component.
 *
 * Tip: <PreferenceSetter> is a great helper for mocking preferences in
 * unit tests. Prefer it to calling the prefenrceProvider manually.
 *
 * @example
 *
 *     <PreferenceSetter name="list.density" value="small">
 *         <MyPreferencesDependentComponent />
 *     </PreferenceSetter>
 *
 * @example // Using <PreferenceSetter> is equivalent to using `usePreferenceProvider` and setting its value directly.
 *
 * const [_, setDensity] = usePreference('list.density');
 *
 * useEffect(() => {
 *     setDensity('small');
 * }, []);
 *
 * @param {Props}    props
 * @param {string}   props.name Preference name. Required. Separate with dots to namespace, e.g. 'posts.list.columns'
 * @param {any}      props.value Preference value. Required.
 * @param {children} props.children Children are rendered as is on mount
 */
export const PreferenceSetter = ({
    value,
    name,
    children,
}: PreferenceSetterProps) => {
    const { setItem } = usePreferenceProvider();

    useEffect(() => {
        setItem(name, value);
    }, [name, setItem, value]);

    return <>{children}</>;
};

export interface Preferences {
    [key: string]: any;
}

export interface PreferenceSetterProps {
    name: string;
    value: any;
    children: ReactNode;
}
