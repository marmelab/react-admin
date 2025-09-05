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
    offline,
    errorElement,
    render,
    children,
    ...props
}: WithListContextProps<RecordType>) => {
    const context = useListContextWithProps<RecordType>(props);
    const { data, total, isPaused, isPending, isPlaceholderData, error } =
        context;

    if (!isPaused && isPending && loading !== false && loading !== undefined) {
        return loading;
    }

    if (
        isPaused &&
        (isPending || isPlaceholderData) &&
        offline !== false &&
        offline !== undefined
    ) {
        return offline;
    }

    if (error && errorElement !== false && errorElement !== undefined) {
        return errorElement;
    }

    if (
        (data == null || data.length === 0 || total === 0) &&
        empty !== false &&
        empty !== undefined
    ) {
        return empty;
    }

    return render(context) || children;
};

export interface WithListContextProps<RecordType extends RaRecord>
    extends React.PropsWithChildren<
        Partial<
            Pick<
                ListControllerResult<RecordType>,
                'data' | 'total' | 'isPending' | 'error'
            >
        >
    > {
    render: (
        context: Partial<ListControllerResult<RecordType>>
    ) => ReactElement | false | null;
    loading?: React.ReactNode;
    offline?: React.ReactNode;
    errorElement?: React.ReactNode;
    empty?: React.ReactNode;

    /**
     * @deprecated
     */
    label?: string;
}
