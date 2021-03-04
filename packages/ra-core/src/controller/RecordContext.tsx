import * as React from 'react';
import { createContext, ReactNode, useContext, useMemo } from 'react';
import pick from 'lodash/pick';
import { Record } from '../types';

/**
 * Context to store the current record.
 *
 * Use the useRecordContext() hook to read the context. That's what the Edit and Show components do in react-admin.
 *
 * @example
 *
 * import { useEditController, EditContext } from 'ra-core';
 *
 * const Edit = props => {
 *     const { record } = useEditController(props);
 *     return (
 *         <RecordContextProvider value={record}>
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
    const value = useMemo(() => pick(context, ['record']), [context.record]); // eslint-disable-line
    return value;
};

/**
 * Hook to read the record from a RecordContext.
 *
 * Must be used within a <RecordContext> such as provided by the <EditContextProvider>
 * (e.g. as a descendent of <Edit> or <EditBase>) or within a <ShowContextProvider>
 * (e.g. as a descendent of <Show> or <ShowBase>)
 *
 * @example // basic usage
 *
 * import { useRecordContext } from 'ra-core';
 *
 * const TitleField = () => {
 *     const record = useRecordContext();
 *     return <span>{record && record.title}</span>;
 * };
 *
 * @example // allow record override via props
 *
 * import { useRecordContext } from 'ra-core';
 *
 * const TitleField = (props) => {
 *     const record = useRecordContext(props);
 *     return <span>{record && record.title}</span>;
 * };
 * render(<TextField record={record} />);
 *
 * @returns {Record} A record object
 */
export const useRecordContext = <
    RecordType extends Record | Omit<Record, 'id'> = Record
>(
    props: UseRecordContextParams<RecordType>
): RecordType => {
    // Can't find a way to specify the RecordType when CreateContext is declared
    // @ts-ignore
    const context = useContext<RecordType>(RecordContext);

    return (props && props.record) || context;
};

export interface UseRecordContextParams<
    RecordType extends Record | Omit<Record, 'id'> = Record
> {
    record?: RecordType;
    [key: string]: any;
}

export interface RecordContextOptions<
    RecordType extends Record | Omit<Record, 'id'> = Record
> {
    children: ReactNode;
    value?: RecordType;
}
