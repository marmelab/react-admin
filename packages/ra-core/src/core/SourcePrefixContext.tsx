import { createContext, useContext } from 'react';

export type SourceContextValue = (source: string) => string;

/**
 * Context to that provides a function that accept a source and return a modified source (prefixed, suffixed, etc.) for fields and inputs.
 */
export const SourceContext = createContext<SourceContextValue>(null);

export const SourceContextProvider = SourceContext.Provider;

/**
 * Hook to get a source that may be prefixed, suffixed, etc. by a parent component.
 * @param source The original field or input source
 * @returns The modified source
 */
export const useWrappedSource = (source: string) => {
    const context = useContext(SourceContext);
    return context ? context(source) : source;
};
