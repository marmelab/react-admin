import { createContext } from 'react';

export type SourceContextValue = (source: string) => string;

/**
 * Context that provides a function that accept a source and return a modified source (prefixed, suffixed, etc.) for fields and inputs.
 *
 * @example
 * const CoordinatesInput = props => {
 *   return (
 *     <SouceContextProvider value={source => `coordinates.${source}`}>
 *       <TextInput source="lat" />
 *       <TextInput source="lng" />
 *     </SouceContextProvider>
 *   );
 * };
 */
export const SourceContext = createContext<SourceContextValue>(null);

export const SourceContextProvider = SourceContext.Provider;
