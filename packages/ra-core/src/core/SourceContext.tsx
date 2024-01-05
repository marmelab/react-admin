import { createContext, useContext } from 'react';

export type SourceContextValue = {
    /*
     * Returns the source for a field or input, modified according to the context.
     */
    getSource: (source: string) => string;
    /*
     * Returns the label for a field or input, modified according to the context. Returns a translation key.
     */
    getLabel: (source: string) => string;
};

/**
 * Context that provides a function that accept a source and return a modified source (prefixed, suffixed, etc.) for fields and inputs.
 *
 * @example
 * const sourceContext = {
 *  getSource: source => `coordinates.${source}`,
 *  getLabel: source => `resources.posts.fields.${source}`,
 * }
 * const CoordinatesInput = () => {
 *   return (
 *     <SouceContextProvider value={sourceContext}>
 *       <TextInput source="lat" />
 *       <TextInput source="lng" />
 *     </SouceContextProvider>
 *   );
 * };
 */
export const SourceContext = createContext<SourceContextValue>(null);

export const SourceContextProvider = SourceContext.Provider;

export const useSourceContext = () => useContext(SourceContext);
