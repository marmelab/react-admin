import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, useRecordContext, TestMemoryRouter } from 'ra-core';
import { Box, Card, Stack } from '@mui/material';
import { TextField } from '../field';
import { Labeled } from '../Labeled';
import { SimpleShowLayout } from './SimpleShowLayout';
import { EditButton } from '../button';
import TopToolbar from '../layout/TopToolbar';
import { Show } from './Show';

export default { title: 'ra-ui-materialui/detail/Show' };

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
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show>
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithFields = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show>
                        <Stack spacing={2} sx={{ padding: 2 }}>
                            <Labeled label="Title">
                                <TextField source="title" />
                            </Labeled>
                            <Labeled label="Author">
                                <TextField source="author" />
                            </Labeled>
                            <Labeled label="Summary">
                                <TextField source="summary" />
                            </Labeled>
                            <Labeled label="Year">
                                <TextField source="year" />
                            </Labeled>
                        </Stack>
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show
                        actions={
                            <TopToolbar>
                                <EditButton />
                            </TopToolbar>
                        }
                    >
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show title="Hello">
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleElement = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show title={<span>Hello</span>}>
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const TitleFalse = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show title={false}>
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show aside={<AsideComponent />}>
                        <BookTitle />
                    </Show>
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
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show component={CustomWrapper}>
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show
                        sx={{
                            padding: 2,
                            border: '1px solid #333',
                        }}
                    >
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Meta = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
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
                show={() => (
                    <Show queryOptions={{ meta: { foo: 'bar ' } }}>
                        <BookTitle />
                    </Show>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={() => (
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="title" />
                            <TextField source="author" />
                            <TextField source="summary" />
                            <TextField source="year" />
                        </SimpleShowLayout>
                    </Show>
                )}
                edit={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);
