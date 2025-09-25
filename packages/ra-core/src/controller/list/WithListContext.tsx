import React, { ReactNode } from 'react';
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
    error,
    render,
    children,
    ...props
}: WithListContextProps<RecordType>) => {
    const context = useListContextWithProps<RecordType>(props);
    const {
        data,
        total,
        isPaused,
        isPending,
        isPlaceholderData,
        error: errorState,
    } = context;

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

    if (errorState && error !== false && error !== undefined) {
        return error;
    }

    if (
        (data == null || data.length === 0 || total === 0) &&
        empty !== false &&
        empty !== undefined
    ) {
        return empty;
    }

    if (render) {
        return render(context);
    }

    return children;
};

export interface WithListContextProps<RecordType extends RaRecord>
    extends React.PropsWithChildren<
        Partial<
            Pick<
                ListControllerResult<RecordType>,
                'data' | 'total' | 'isPending'
            >
        >
    > {
    render?: (context: Partial<ListControllerResult<RecordType>>) => ReactNode;
    loading?: React.ReactNode;
    offline?: React.ReactNode;
    errorState?: ListControllerResult<RecordType>['error'];
    error?: React.ReactNode;
    empty?: React.ReactNode;

    /**
     * @deprecated
     */
    label?: string;
}
