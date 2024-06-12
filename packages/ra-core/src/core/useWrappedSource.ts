import { useSourceContext } from './SourceContext';

/**
 * Get the source prop for a field or input by checking if a source context is available.
 * @param {string} source The original source prop
 * @returns {string} The source prop, either the original one or the one modified by the SourceContext.
 * @example
 * const MyInput = ({ source, ...props }) => {
 *   const finalSource = useWrappedSource(source);
 *   return <input name={finalSource} {...props} />;
 * };
 */
export const useWrappedSource = (source: string) => {
    const sourceContext = useSourceContext();
    return sourceContext.getSource(source);
};
