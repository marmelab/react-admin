import { createContext, useContext } from 'react';

export type SourceContextValue =
    | {
          /*
           * Returns the source for a field or input, modified according to the context.
           */
          getSource: (source: string) => string;
          /*
           * Returns the label for a field or input, modified according to the context. Returns a translation key.
           */
          getLabel: (source: string) => string;
      }
    | undefined;

/**
 * Context that provides a function that accept a source and return getters for the modified source and label.
 *
 * This allows some special inputs to prefix or suffix the source of their children.
 *
 * @example
 * const sourceContext = {
 *  getSource: source => `coordinates.${source}`,
 *  getLabel: source => `resources.posts.fields.${source}`,
 * }
 * const CoordinatesInput = () => {
 *   return (
 *     <SourceContextProvider value={sourceContext}>
 *       <TextInput source="lat" />
 *       <TextInput source="lng" />
 *     </SourceContextProvider>
 *   );
 * };
 */
export const SourceContext = createContext<SourceContextValue>(undefined);

export const SourceContextProvider = SourceContext.Provider;

export const useSourceContext = () => {
    const context = useContext(SourceContext);

    if (!context) {
        throw new Error('Inputs must be used inside a react-admin Form');
    }

    return context;
};

export const useOptionalSourceContext = () => useContext(SourceContext);
