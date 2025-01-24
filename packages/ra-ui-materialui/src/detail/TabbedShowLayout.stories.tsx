import * as React from 'react';
import { Divider as MuiDivider } from '@mui/material';
import {
    useRecordContext,
    WithRecord,
    TestMemoryRouter,
    RaRecord,
    testDataProvider,
    ResourceContextProvider,
} from 'ra-core';
import { Labeled } from '../Labeled';
import { TextField, NumberField } from '../field';
import { TabbedShowLayout } from './TabbedShowLayout';
import { AdminContext } from '../AdminContext';
import { Route, Routes } from 'react-router';
import { Show } from './Show';

export default { title: 'ra-ui-materialui/detail/TabbedShowLayout' };

const data = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    summary:
        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
    year: 1869,
};

const Wrapper = ({
    children,
    record = data,
}: {
    children: React.ReactNode;
    record?: RaRecord;
}) => (
    <TestMemoryRouter
        initialEntries={[`/books/${encodeURIComponent(record.id)}/show`]}
    >
        <AdminContext
            i18nProvider={{
                translate: (x, options) => options?._ ?? x,
                changeLocale: () => Promise.resolve(),
                getLocale: () => 'en',
            }}
            dataProvider={testDataProvider({
                // @ts-ignore
                getOne: () => Promise.resolve({ data: record }),
            })}
            defaultTheme="light"
        >
            <ResourceContextProvider value="books">
                <Routes>
                    <Route
                        path="/books/:id/show/*"
                        element={<Show sx={{ width: 600 }}>{children}</Show>}
                    />
                </Routes>
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="First">
                <TextField source="id" />
                <TextField source="title" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Second">
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);

export const Count = () => (
    <Wrapper>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="Main">
                <TextField source="id" />
                <TextField source="title" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Details">
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Reviews" count={27}>
                <TextField source="reviews" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);

const BookTitle = () => {
    const record = useRecordContext();
    return record ? <span>{record.title}</span> : null;
};

export const CustomChild = () => (
    <Wrapper>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="First">
                <BookTitle />
                <WithRecord render={record => <span>{record.author}</span>} />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);

export const CustomLabel = () => (
    <Wrapper>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="First">
                <TextField label="Identifier" source="id" />
                <TextField source="title" />
                <Labeled label="Author name">
                    <TextField source="author" />
                </Labeled>
                <TextField label={false} source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);

export const Spacing = () => (
    <Wrapper>
        <TabbedShowLayout spacing={3}>
            <TabbedShowLayout.Tab label="First">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);

export const Divider = () => (
    <Wrapper>
        <TabbedShowLayout divider={<MuiDivider />}>
            <TabbedShowLayout.Tab label="First">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);

export const SX = () => (
    <Wrapper>
        <TabbedShowLayout
            sx={{
                margin: 2,
                padding: 2,
                bgcolor: 'text.disabled',
            }}
        >
            <TabbedShowLayout.Tab label="First">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);
