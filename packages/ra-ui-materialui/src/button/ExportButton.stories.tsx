import * as React from 'react';
import {
    CoreAdminContext,
    ListContextProvider,
    testDataProvider,
} from 'ra-core';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { ExportButton } from './ExportButton';

export default { title: 'ra-ui-materialui/button/ExportButton' };

const theme = createTheme();

const dataProvider = testDataProvider({
    getList: () => Promise.resolve({ data: [], total: 0 }),
});

const noopExporter = () => undefined;

export const Basic = () => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ThemeProvider theme={theme}>
            <ListContextProvider
                value={
                    {
                        resource: 'posts',
                        filterValues: {},
                        exporter: noopExporter,
                        total: 1,
                    } as any
                }
            >
                <ExportButton />
            </ListContextProvider>
        </ThemeProvider>
    </CoreAdminContext>
);

export const WithGetData = () => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ThemeProvider theme={theme}>
            <ListContextProvider
                value={
                    {
                        resource: 'posts',
                        filterValues: {},
                        exporter: noopExporter,
                        total: 1,
                        getData: () =>
                            Promise.resolve([{ id: 1, title: 'Book' }]),
                    } as any
                }
            >
                <ExportButton />
            </ListContextProvider>
        </ThemeProvider>
    </CoreAdminContext>
);
