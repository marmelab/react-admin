import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import { ResourceContextProvider } from 'ra-core';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../../AdminContext';
import { List } from '../List';
import { DataTable } from './DataTable';
import { ColumnsButton } from './ColumnsButton';

export default { title: 'ra-ui-materialui/list/ColumnsButton' };

const theme = createTheme();

const Wrapper = ({
    children,
    dataProvider = fakeRestDataProvider({
        test: [
            {
                col0: 'a',
                col1: 'b',
                col2: 'c',
                col3: 'd',
                col4: 'e',
                col5: 'f',
                col6: 'g',
                col7: 'h',
            },
        ],
    }),
    resource = 'test',
    actions = undefined,
    aside = undefined,
}: any) => (
    <AdminContext dataProvider={dataProvider} theme={theme}>
        <ResourceContextProvider value={resource}>
            <List
                perPage={5}
                sx={{ px: 4 }}
                actions={actions}
                aside={aside}
                pagination={false}
            >
                {children}
            </List>
        </ResourceContextProvider>
    </AdminContext>
);

const HideMe = (_props: { children?: React.ReactNode }) => null;

export const Basic = () => (
    <Wrapper aside={<ColumnsButton />} actions={null}>
        <DataTable bulkActionButtons={false} hiddenColumns={['col7']}>
            <DataTable.Col source="col0" label="c_0" />
            <DataTable.Col source="col1" label="c_1" />
            <DataTable.Col source="col2" label="c_2" />
            <DataTable.Col source="col3" label="c_3" />
            <DataTable.Col source="col4" label="c_4" />
            <DataTable.Col source="col5" label="c_5" />
            <HideMe>
                <DataTable.Col source="col6" label="c_6" />
            </HideMe>
            <DataTable.Col source="col7" label="c_7" />
        </DataTable>
    </Wrapper>
);
