import { createContext, useContext } from 'react';

export type SourcePrefixContextValue = string;

/**
 * Context to that provides a possible prefix for the source prop of fields and inputs.
 */
export const SourcePrefixContext = createContext<SourcePrefixContextValue>('');

export const SourcePrefixContextProvider = SourcePrefixContext.Provider;

/**
 * Hook to get the source prefix that a field or input should add to its source prop.
 * @returns The source prefix that a field or input should add to its source prop.
 */
export const useSourcePrefix = (): string => {
    const prefix = useContext(SourcePrefixContext);
    return prefix ?? '';
};
