import { useContext } from 'react';
import { SourceContext } from './SourceContext';

/**
 * Hook to get a source that may be prefixed, suffixed, etc. by a parent component. You don't need to call this hook if you use the `useInput` hook.
 * @param source The original field or input source
 * @returns The modified source if the calling component is inside a `SourceContext`, the original source otherwise.
 *
 * @example
 * const MyInput = ({ source, ...props }) => {
 *   const finalSource = useWrappedSource(source);
 *   return <input name={finalSource} {...props} />;
 * };
 */
export const useWrappedSource = (source: string) => {
    const context = useContext(SourceContext);
    return context ? context(source) : source;
};
