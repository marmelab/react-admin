import { useContext } from 'react';
import { RaRecord } from '../../types';
import { RecordContext } from './RecordContext';

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
 * @returns {RaRecord} A record object
 */
export const useRecordContext = <
    RaRecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord
>(
    props?: UseRecordContextParams<RaRecordType>
): RaRecordType => {
    // Can't find a way to specify the RaRecordType when CreateContext is declared
    // @ts-ignore
    const context = useContext<RaRecordType>(RecordContext);

    return (props && props.record) || context;
};

export interface UseRecordContextParams<
    RaRecordType extends RaRecord | Omit<RaRecord, 'id'> = RaRecord
> {
    record?: RaRecordType;
    [key: string]: any;
}
