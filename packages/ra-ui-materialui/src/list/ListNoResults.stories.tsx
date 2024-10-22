import * as React from 'react';
import { useList, ListContextProvider, ResourceContextProvider } from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material';
import { ListNoResults } from './ListNoResults';

export default {
    title: 'ra-ui-materialui/list/ListNoResults',
};

export const NoFilter = () => {
    const context = useList<any>({ data: [] });
    return (
        <ResourceContextProvider value="posts">
            <ListContextProvider value={context}>
                {context.data?.length === 0 && <ListNoResults />}
            </ListContextProvider>
        </ResourceContextProvider>
    );
};

export const WithFilter = () => {
    const context = useList<any>({ data: [{ id: 1 }], filter: { id: 2 } });
    return (
        <ResourceContextProvider value="posts">
            <ThemeProvider theme={createTheme()}>
                <ListContextProvider value={context}>
                    {context.data?.length === 0 ? (
                        <ListNoResults />
                    ) : (
                        <ul>
                            {context.data?.map(record => (
                                <li key={record.id}>
                                    {JSON.stringify(record)}
                                </li>
                            ))}
                        </ul>
                    )}
                </ListContextProvider>
            </ThemeProvider>
        </ResourceContextProvider>
    );
};
