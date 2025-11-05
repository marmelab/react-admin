import * as React from 'react';
import { RaRecord } from '../../types';
import { useListContextWithProps } from './useListContextWithProps';
import { RecordContextProvider } from '../record';
import { ListControllerSuccessResult } from './useListController';

export const RecordsIterator = <RecordType extends RaRecord = any>(
    props: RecordsIteratorProps<RecordType>
) => {
    const { children, render } = props;
    const { data, total, isPending, error } =
        useListContextWithProps<RecordType>(props);

    if (
        isPending === true ||
        error ||
        data == null ||
        data.length === 0 ||
        total === 0
    ) {
        return null;
    }

    if (!render && !children) {
        return null;
    }

    return (
        <>
            {data.map((record, index) => (
                <RecordContextProvider
                    key={record.id ?? `row${index}`}
                    value={record}
                >
                    {render ? render(record, index) : children}
                </RecordContextProvider>
            ))}
        </>
    );
};

export interface RecordsIteratorProps<RecordType extends RaRecord = any>
    extends Partial<ListControllerSuccessResult<RecordType>> {
    children?: React.ReactNode;
    render?: (record: RecordType, index: number) => React.ReactNode;
}

/**
 * @deprecated use RecordsIterator instead.
 */
export const ListIterator = RecordsIterator;
/**
 * @deprecated use RecordsIteratorProps instead.
 */
export type ListIteratorProps = RecordsIteratorProps;
