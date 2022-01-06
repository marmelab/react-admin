import * as React from 'react';
import {
    CoreAdminContext,
    RecordContextProvider,
    ResourceContextProvider,
    ListContextProvider,
} from 'ra-core';
import { createMemoryHistory } from 'history';
import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import { TextField, DateField } from '../field';
import { ReferenceOneField } from './ReferenceOneField';
import { SimpleShowLayout } from '../detail/SimpleShowLayout';
import { Datagrid } from '../list/datagrid/Datagrid';

export default { title: 'ra-ui-materialui/fields/ReferenceOneField' };

const dataProvider = {
    getManyReference: (resource, params) => {
        console.log('getManyReference', resource, params);
        return Promise.resolve({
            data: [
                {
                    id: 1,
                    body:
                        'James Joyce was an Irish novelist, poet and short story writer.',
                    published_at: '2022-01-12T11:23:00',
                },
            ],
            total: 1,
        });
    },
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1/show'] });

const Wrapper = ({ children }) => (
    <CoreAdminContext dataProvider={dataProvider} history={history}>
        <ResourceContextProvider value="authors">
            <RecordContextProvider
                value={{ id: 1, first_name: 'James', last_name: 'Joyce' }}
            >
                {children}
            </RecordContextProvider>
        </ResourceContextProvider>
    </CoreAdminContext>
);

export const Basic = () => (
    <Wrapper>
        <ReferenceOneField reference="bios" target="id">
            <TextField source="body" />
        </ReferenceOneField>
    </Wrapper>
);

export const Multiple = () => (
    <Wrapper>
        <h3>Author</h3>
        <TextField source="first_name" />
        &nbsp;
        <TextField source="last_name" />
        <h3>Bio</h3>
        <ReferenceOneField reference="bios" target="id">
            <TextField source="body" />
        </ReferenceOneField>
        <h3>Bio published at</h3>
        <ReferenceOneField reference="bios" target="id">
            <DateField source="published_at" />
        </ReferenceOneField>
    </Wrapper>
);

export const InShowLayout = () => (
    <Wrapper>
        <SimpleShowLayout>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceOneField label="Bio" reference="bios" target="id">
                <TextField source="body" />
            </ReferenceOneField>
        </SimpleShowLayout>
    </Wrapper>
);

const ListWrapper = ({ children }) => (
    <ThemeProvider theme={createTheme()}>
        <Wrapper>
            <ListContextProvider
                value={{
                    total: 1,
                    data: [{ id: 1, first_name: 'James', last_name: 'Joyce' }],
                    currentSort: { field: 'first_name', order: 'ASC' },
                }}
            >
                {children}
            </ListContextProvider>
        </Wrapper>
    </ThemeProvider>
);

export const InDatagrid = () => (
    <ListWrapper>
        <Datagrid>
            <TextField source="first_name" />
            <TextField source="last_name" />
            <ReferenceOneField label="Bio" reference="bios" target="id">
                <TextField source="body" />
            </ReferenceOneField>
        </Datagrid>
    </ListWrapper>
);
