import { useEffect, useRef, isValidElement, ReactNode } from 'react';
import { usePreference } from './usePreference';

/**
 * A component to set application preferences on mount declaratively
 *
 * To use it, just wrap any component that need to use the corresponding
 * preference with <PreferenceSetter path="my.preference" value="myvalue">.
 * This wrapping needs to be done to ensure that the corresponding preference
 * is set before rendering the wrapped component.
 *
 * Tip: <PreferenceSetter> is a great helper for mocking preferences in
 * unit tests. Prefer it to calling the prefenrceProvider manually.
 *
 * @example
 *
 *     <PreferenceSetter path="list.density" value="small">
 *         <MyPreferencesDependentComponent />
 *     </PreferenceSetter>
 *
 * @example // Using <PreferenceSetter> is equivalent to using `usePreference` and setting its value directly.
 *
 * const [_, setDensity] = usePreference('list.density');
 *
 * useEffect(() => {
 *     setDensity('small');
 * }, []);
 *
 * @param {Props}    props
 * @param {string}   props.path Preference name. Required. Separate with dots to namespace, e.g. 'posts.list.columns'
 * @param {any}      props.value Preference value. Required.
 * @param {children} props.children Children are rendered as is on mount
 */
export const PreferenceSetter = ({
    value,
    path,
    children,
}: PreferenceSetterProps) => {
    const [_, setPreferences] = usePreference(path);
    const isInitialized = useRef(false);

    useEffect(() => {
        setPreferences(value);
        isInitialized.current = true;
    }, [path, value]); // eslint-disable-line react-hooks/exhaustive-deps

    // do not render the children until the value is set
    if (!isInitialized.current) {
        return null;
    }

    if (!isValidElement(children)) {
        throw new Error('PreferenceSetter child must be a valid element');
    }

    return children;
};

export interface Preferences {
    [key: string]: any;
}

export interface PreferenceSetterProps {
    path: string;
    value: any;
    children: ReactNode;
}
