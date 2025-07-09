import * as React from 'react';
import { RaRecord } from '../../types';
import { useListContextWithProps } from './useListContextWithProps';
import { RecordContextProvider } from '../record';

export const ListIterator = <RecordType extends RaRecord = any>(
    props: ListIteratorProps<RecordType>
) => {
    const { children, empty = null, loading = null, render } = props;
    const { data, total, isPending } =
        useListContextWithProps<RecordType>(props);

    if (isPending === true) {
        return loading ? loading : null;
    }

    if (data == null || data.length === 0 || total === 0) {
        return empty ? empty : null;
    }

    if (!render && !children) {
        throw new Error(
            '<ListIterator>: either `render` or `children` prop must be provided'
        );
    }

    if (render) {
        return (
            <>
                {data.map((record, index) => (
                    <RecordContextProvider
                        key={record.id ?? `row${index}`}
                        value={record}
                    >
                        {render(record, index)}
                    </RecordContextProvider>
                ))}
            </>
        );
    }

    return (
        <>
            {data.map((record, index) => (
                <RecordContextProvider
                    key={record.id ?? `row${index}`}
                    value={record}
                >
                    {children}
                </RecordContextProvider>
            ))}
        </>
    );
};

export interface ListIteratorProps<RecordType extends RaRecord = any> {
    children?: React.ReactNode;
    empty?: React.ReactElement;
    loading?: React.ReactElement;
    render?: (record: RecordType, index: number) => React.ReactNode;
    data?: RecordType[];
    total?: number;
    isPending?: boolean;
}
