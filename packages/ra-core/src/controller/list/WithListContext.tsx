import { ReactElement } from 'react';
import { RaRecord } from '../../types';
import { ListControllerResult } from './useListController';
import { useListContext } from './useListContext';

/**
 * Render prop version of useListContext
 *
 * @example
 * const BookList = () => (
 *    <List>
 *       <WithListContext render={({ data }) => (
 *          <ul>
 *            {data ? data.map(record => (
 *              <li key={record.id}>{record.title}</li>
 *            )) : null}
 *          </ul>
 *       )} />
 *   </List>
 * );
 */
export const WithListContext = <RecordType extends RaRecord>({
    render,
}: WithListContextProps<RecordType>) => render(useListContext<RecordType>());

export interface WithListContextProps<RecordType extends RaRecord> {
    render: (context: ListControllerResult<RecordType>) => ReactElement | null;
    label?: string;
}
