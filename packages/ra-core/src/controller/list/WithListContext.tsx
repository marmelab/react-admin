import React, { ReactElement } from 'react';
import { RaRecord } from '../../types';
import { ListControllerResult } from './useListController';
import { useListContextWithProps } from './useListContextWithProps';

/**
 * Render prop version of useListContextWithProps
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
    ...props
}: WithListContextProps<RecordType>) => {
    const context = useListContextWithProps<RecordType>(props);
    const { data, total, isPending, error } = context;

    if (isPending === true && loading) {
        return loading;
    }

    if (error && errorElement) {
        return errorElement;
    }

    if ((data == null || data.length === 0 || total === 0) && empty) {
        return empty;
    }

    return render(context) || null;
};

export type WithListContextProps<RecordType extends RaRecord> = Partial<
    Pick<
        ListControllerResult<RecordType>,
        'data' | 'total' | 'isPending' | 'error'
    >
> & {
    render: (
        context: Partial<ListControllerResult<RecordType>>
    ) => ReactElement | false | null;
    empty?: React.ReactNode;
    loading?: React.ReactNode;
    error?: React.ReactNode;
};
