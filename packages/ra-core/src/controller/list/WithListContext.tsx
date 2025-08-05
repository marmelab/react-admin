import React, { ReactElement } from 'react';
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
 *            {data && data.map(record => (
 *              <li key={record.id}>{record.title}</li>
 *            ))}
 *          </ul>
 *       )} />
 *   </List>
 * );
 */
export const WithListContext = <RecordType extends RaRecord>({
    empty,
    loading,
    error: errorElement,
    render,
}: WithListContextProps<RecordType>) => {
    const context = useListContext<RecordType>();
    const { data, total, isPending, error } = context;

    if (isPending === true) {
        return loading ? loading : null;
    }

    if (error) {
        return errorElement ? errorElement : null;
    }

    if (data == null || data.length === 0 || total === 0) {
        return empty ? empty : null;
    }

    return render(context) || null;
};

export interface WithListContextProps<RecordType extends RaRecord> {
    render: (
        context: ListControllerResult<RecordType>
    ) => ReactElement | false | null;
    label?: string;
    empty?: React.ReactElement;
    loading?: React.ReactElement;
    error?: React.ReactElement;
}

/**
 * @deprecated use WithListContext instead
 */
export const ListIterator = WithListContext;
