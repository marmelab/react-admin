import * as React from 'react';
import { RecordContextProvider, WithListContext } from '../';

export const SimpleList = ({
    children,
    render,
    inline = false,
}: {
    children?: React.ReactNode;
    render?: (record: any) => React.ReactNode;
    inline?: boolean;
}) => (
    <WithListContext
        render={({ data, isPending }) =>
            isPending ? null : children ? (
                children
            ) : (
                <ul
                    style={{
                        display: 'flex',
                        flexDirection: inline ? 'row' : 'column',
                        gap: '1em',
                        listStyle: 'none',
                        marginBlockStart: 0,
                        marginBlockEnd: 0,
                        paddingInlineStart: 0,
                    }}
                >
                    {data?.map(record => (
                        <RecordContextProvider key={record.id} value={record}>
                            <li>{render ? render(record) : children}</li>
                        </RecordContextProvider>
                    ))}
                </ul>
            )
        }
    />
);
