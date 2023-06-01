import { RenderRecordFunction } from '../../types';
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
export const WithRecord = <RecordType extends Record<string, unknown> = any>({
    render,
}: WithRecordProps<RecordType>) => {
    const record = useRecordContext<RecordType>();
    return record ? render(record) : null;
};

export interface WithRecordProps<
    RecordType extends Record<string, unknown> = any
> {
    render: RenderRecordFunction<RecordType>;
    label?: string;
}
