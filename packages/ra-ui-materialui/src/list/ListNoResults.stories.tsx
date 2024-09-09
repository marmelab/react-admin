import * as React from 'react';
import { useList, ListContextProvider } from 'ra-core';
import { ListNoResults } from './ListNoResults';

export default {
    title: 'ra-ui-materialui/list/ListNoResults',
};

export const NoFilter = () => {
    const context = useList<any>({ data: [] });
    return (
        <ListContextProvider value={context}>
            {context.data?.length === 0 && <ListNoResults />}
        </ListContextProvider>
    );
};

export const WithFilter = () => {
    const context = useList<any>({ data: [{ id: 1 }], filter: { id: 2 } });
    return (
        <ListContextProvider value={context}>
            {context.data?.length === 0 ? (
                <ListNoResults />
            ) : (
                <ul>
                    {context.data?.map(record => (
                        <li key={record.id}>{JSON.stringify(record)}</li>
                    ))}
                </ul>
            )}
        </ListContextProvider>
    );
};
