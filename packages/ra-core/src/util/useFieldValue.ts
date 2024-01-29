import get from 'lodash/get';
import { RaRecord } from '../types';
import { useRecordContext } from '../controller';
import { useSourceContext } from '../core';

/**
 * A hook that gets the value of a field of the current record.
 * @param options The hook options
 * @param options.source The field source
 * @param options.record The record to use. Uses the record from the RecordContext if not provided
 * @returns The field value
 *
 * @example
 * const MyField = (props: { source: string }) => {
 *   const value = useFieldValue(props);
 *   return <span>{value}</span>;
 * }
 */
export const useFieldValue = <RecordType = RaRecord>(
    options: UseFieldValueOptions<RecordType>
) => {
    const { source } = options;
    const sourceContext = useSourceContext();
    const record = useRecordContext<RecordType>(options);

    return get(record, sourceContext?.getSource(source) ?? source);
};

export interface UseFieldValueOptions<RecordType = RaRecord> {
    source?: string;
    record?: RecordType;
}
