import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, Form, useRecordContext, TestMemoryRouter } from 'ra-core';
import { Box, Card, Stack } from '@mui/material';

import { TextInput } from '../input';
import { SimpleForm } from '../form/SimpleForm';
import { ShowButton, SaveButton } from '../button';
import TopToolbar from '../layout/TopToolbar';
import { Edit } from './Edit';

export default { title: 'ra-ui-materialui/detail/Edit' };

const dataProvider = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                author: 'Leo Tolstoy',
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }),
} as any;

const BookTitle = () => {
    const record = useRecordContext();
    return record ? <span>{record.title}</span> : null;
};

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithForm = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <Form>
                            <Stack spacing={2} sx={{ padding: 2 }}>
                                <TextInput source="title" />
                                <TextInput source="author" />
                                <TextInput source="summary" />
                                <TextInput source="year" />
                            </Stack>
                            <SaveButton />
                        </Form>
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        actions={
                            <TopToolbar>
                                <ShowButton />
                            </TopToolbar>
                        }
                    >
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit title="Hello">
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleElement = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit title={<span>Hello</span>}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleFalse = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit title={false}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit aside={<AsideComponent />}>
                        <BookTitle />
                    </Edit>
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
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit component={CustomWrapper}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        sx={{
                            padding: 2,
                            border: '1px solid #333',
                        }}
                    >
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Meta = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin
            dataProvider={
                {
                    getOne: (resource, params) => {
                        console.log('getOne', resource, params);
                        return dataProvider.getOne(resource, params);
                    },
                } as any
            }
        >
            <Resource
                name="books"
                edit={() => (
                    <Edit queryOptions={{ meta: { foo: 'bar ' } }}>
                        <BookTitle />
                    </Edit>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books/1/Edit']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                edit={() => (
                    <Edit>
                        <SimpleForm>
                            <TextInput source="title" />
                            <TextInput source="author" />
                            <TextInput source="summary" />
                            <TextInput source="year" />
                        </SimpleForm>
                    </Edit>
                )}
                show={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);
