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

const PostShowBasic = () => (
    <Show>
        <BookTitle />
    </Show>
);

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowBasic} />
        </Admin>
    </TestMemoryRouter>
);

const PostShowWithFields = () => (
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
);

export const WithFields = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowWithFields} />
        </Admin>
    </TestMemoryRouter>
);

const PostShowWithCustomActions = () => (
    <Show
        actions={
            <TopToolbar>
                <EditButton />
            </TopToolbar>
        }
    >
        <BookTitle />
    </Show>
);

export const Actions = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowWithCustomActions} />
        </Admin>
    </TestMemoryRouter>
);

const PostShowWithTitle = () => (
    <Show title="Hello">
        <BookTitle />
    </Show>
);

export const Title = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowWithTitle} />
        </Admin>
    </TestMemoryRouter>
);

const AsideComponent = () => <Card sx={{ padding: 2 }}>Aside</Card>;

const PostShowWithAside = () => (
    <Show aside={<AsideComponent />}>
        <BookTitle />
    </Show>
);

export const Aside = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowWithAside} />
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

const PostShowWithComponent = () => (
    <Show component={CustomWrapper}>
        <BookTitle />
    </Show>
);

export const Component = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowWithComponent} />
        </Admin>
    </TestMemoryRouter>
);

const PostShowWithStyles = () => (
    <Show
        sx={{
            padding: 2,
            border: '1px solid #333',
        }}
    >
        <BookTitle />
    </Show>
);

export const SX = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="books" show={PostShowWithStyles} />
        </Admin>
    </TestMemoryRouter>
);

const DefaultPostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="title" />
            <TextField source="author" />
            <TextField source="summary" />
            <TextField source="year" />
        </SimpleShowLayout>
    </Show>
);

const dataProviderWithLog = {
    getOne: (resource, params) => {
        console.log('getOne', resource, params);
        return dataProvider.getOne(resource, params);
    },
} as any;

const PostShowWithMeta = () => (
    <Show queryOptions={{ meta: { foo: 'bar ' } }}>
        <BookTitle />
    </Show>
);

export const Meta = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProviderWithLog}>
            <Resource name="books" show={PostShowWithMeta} />
        </Admin>
    </TestMemoryRouter>
);

export const Default = () => (
    <TestMemoryRouter initialEntries={['/books/1/show']}>
        <Admin dataProvider={dataProvider}>
            <Resource
                name="books"
                show={DefaultPostShow}
                edit={() => <span />}
            />
        </Admin>
    </TestMemoryRouter>
);
