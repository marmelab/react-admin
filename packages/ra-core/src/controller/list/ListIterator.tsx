import * as React from 'react';
import { RaRecord } from '../../types';
import { useListContextWithProps } from './useListContextWithProps';
import { RecordContextProvider } from '../record';

export const ListIterator = <RecordType extends RaRecord = any>(
    props: ListIteratorProps<RecordType>
) => {
    const { children, empty = null, pending = null, render } = props;
    const { data, total, isPending } =
        useListContextWithProps<RecordType>(props);

    if (isPending === true) {
        return pending ? pending : null;
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
    pending?: React.ReactElement;
    render?: (record: RecordType, index: number) => React.ReactNode;
    // can be injected when using the component without context
    resource?: string;
    data?: RecordType[];
    total?: number;
    isPending?: boolean;
}
