import * as React from 'react';
import { createContext, useContext, ReactNode } from 'react';
import pick from 'lodash/pick';
import { Record } from '../types';

/**
 * Context to store the result of the useRecord() hook.
 *
 * Use the useRecordContext() hook to read the context. That's what the Edit components do in react-admn.
 *
 * @example
 *
 * import { useEditController, EditContext } from 'ra-core';
 *
 * const Edit = props => {
 *     const controllerProps = useEditController(props);
 *     return (
 *         <RecordContextProvider value={controllerProps}>
 *             ...
 *         </RecordContextProvider>
 *     );
 * };
 */
export const RecordContext = createContext<RecordContextValue>({
    loaded: null,
    loading: null,
    record: null,
});

export const RecordContextProvider = ({
    children,
    value,
}: RecordContextOptions) => (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
);
RecordContext.displayName = 'RecordContext';

export const usePickRecordContext = <
    ContextType extends RecordContextValue = RecordContextValue
>(
    context: ContextType
) => {
    return pick(context, ['record', 'loaded', 'loading']);
};

/**
 * Hook to read the record from a context which provide one, such as the EditContext or ShowContext.
 *
 * Must be used within a <EditContextProvider> (e.g. as a descendent of <Edit>
 * or <EditBase>) or within a <ShowContextProvider> (e.g. as a descendent of <Show>
 * or <ShowBase>)
 *
 * @returns {RecordContextValue} The record context
 */
export const useRecordContext = () => {
    return useContext<RecordContextValue>(RecordContext);
};

export interface RecordContextValue {
    record?: Partial<Record>;
    loaded: boolean;
    loading: boolean;
}

export interface RecordContextOptions {
    children: ReactNode;
    value?: RecordContextValue;
}
