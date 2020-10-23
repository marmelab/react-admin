import * as React from 'react';
import { createContext, useContext, ReactNode } from 'react';
import pick from 'lodash/pick';
import { Record } from '../types';

/**
 * Context to store the result of the useRecord() hook.
 *
 * Use the useRecordContext() hook to read the context. That's what the Edit and Show components do in react-admn.
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
export const RecordContext = createContext<Record | Omit<Record, 'id'>>(
    undefined
);

export const RecordContextProvider = ({
    children,
    value,
}: RecordContextOptions) => (
    <RecordContext.Provider value={value}>{children}</RecordContext.Provider>
);
RecordContext.displayName = 'RecordContext';

export const usePickRecordContext = <
    RecordType extends Record | Omit<Record, 'id'> = Record
>(
    context: RecordType
) => {
    return pick(context, ['record']);
};

/**
 * Hook to read the record from a context which provide one, such as the EditContext or ShowContext.
 *
 * Must be used within a <RecordContext> such as provided by the <EditContextProvider>
 * (e.g. as a descendent of <Edit> or <EditBase>) or within a <ShowContextProvider>
 * (e.g. as a descendent of <Show> or <ShowBase>)
 *
 * @returns {Record} The record context
 */
export const useRecordContext = <
    RecordType extends Record | Omit<Record, 'id'> = Record
>() => {
    // Can't find a way to specify the RecordType when CreateContext is declared
    // @ts-ignore
    return useContext<RecordType>(RecordContext);
};

export interface RecordContextOptions<
    RecordType extends Record | Omit<Record, 'id'> = Record
> {
    children: ReactNode;
    value?: RecordType;
}
