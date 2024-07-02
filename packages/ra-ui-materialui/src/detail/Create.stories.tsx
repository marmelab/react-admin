import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, Form, TestMemoryRouter, testDataProvider } from 'ra-core';
import { Box, Card, Stack } from '@mui/material';

import { TextInput } from '../input';
import { SimpleForm } from '../form/SimpleForm';
import { ListButton, SaveButton } from '../button';
import TopToolbar from '../layout/TopToolbar';
import { Create } from './Create';

export default { title: 'ra-ui-materialui/detail/Create' };

const dataProvider = testDataProvider();

const Content = () => <div>Create content</div>;

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithForm = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <Form>
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <TextInput source="title" />
                                <TextInput source="author" />
                                <TextInput source="summary" />
                                <TextInput source="year" />
                            </Stack>
                            <SaveButton />
                        </Form>
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create
                        actions={
                            <TopToolbar>
                                <ListButton />
                            </TopToolbar>
                        }
                    >
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create title="Hello">
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleElement = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create title={<span>Hello</span>}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleFalse = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create title={false}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create aside={<AsideComponent />}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const CustomWrapper = ({ children }) => (
    <Box
        sx={{ padding: 2, width: 200, border: 'solid 1px black' }}
        data-testid="custom-component"
    >
        {children}
    </Box>
);

export const Component = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create component={CustomWrapper}>
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create
                        sx={{
                            padding: 2,
                            border: '1px solid red',
                        }}
                    >
                        <Content />
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                create={() => (
                    <Create>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="summary" />
                            <TextInput source="year" />
                        </SimpleForm>
                    </Create>
                )}
                show={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);
