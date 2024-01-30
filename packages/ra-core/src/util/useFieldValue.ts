import get from 'lodash/get';
import { RaRecord } from '../types';
import { useRecordContext } from '../controller';
import { useSourceContext } from '../core';

/**
 * A hook that gets the value of a field of the current record.
 * @param params The hook parameters
 * @param params.source The field source
 * @param params.record The record to use. Uses the record from the RecordContext if not provided
 * @returns The field value
 *
 * @example
 * const MyField = (props: { source: string }) => {
 *   const value = useFieldValue(props);
 *   return <span>{value}</span>;
 * }
 */
export const useFieldValue = <RecordType = RaRecord>(
    params: UseFieldValueOptions<RecordType>
) => {
    const { source } = params;
    const sourceContext = useSourceContext();
    const record = useRecordContext<RecordType>(params);

    return get(record, sourceContext?.getSource(source) ?? source);
};

export interface UseFieldValueOptions<RecordType = RaRecord> {
    source: string;
    record?: RecordType;
}
