import { ReactElement } from 'react';
import { RaRecord } from '../../types';
import { useRecordContext } from './useRecordContext';

/**
 * Render prop version of useRecordContext
 *
 * @example
 * const BookShow = () => (
 *    <Show>
 *       <SimpleShowLayout>
 *          <WithRecord render={record => <span>{record.title}</span>} />
 *      </SimpleShowLayout>
 *   </Show>
 * );
 */
export const WithRecord = <RaRecordType extends RaRecord>({
    render,
}: WithRecordProps<RaRecordType>) => {
    const record = useRecordContext<RaRecordType>();
    return record ? render(record) : null;
};

export interface WithRecordProps<RaRecordType extends RaRecord> {
    render: (record: RaRecordType) => ReactElement;
    label?: string;
}
