import { Divider as MuiDivider } from '@mui/material';
import {
    ResourceContextProvider,
    WithRecord,
    testDataProvider,
    useRecordContext,
} from 'ra-core';
import * as React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminContext } from '../AdminContext';
import { Labeled } from '../Labeled';
import { Show } from '../detail';
import { NumberField, TextField } from '../field';
import { TabbedShowLayout } from './TabbedShowLayout';

export default { title: 'ra-ui-materialui/detail/TabbedShowLayout' };

const record = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    summary:
        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
    year: 1869,
};

const Wrapper = ({ children }) => (
    <AdminContext
        i18nProvider={{
            translate: (x, options) => options?._ ?? x,
            changeLocale: () => Promise.resolve(),
            getLocale: () => 'en',
        }}
        dataProvider={testDataProvider({
            getOne: () => Promise.resolve({ data: record }),
        })}
    >
        <Routes>
            <Route
                path="/books/:id/show/*"
                element={
                    <ResourceContextProvider value="books">
                        <Show id={1} sx={{ width: 600 }}>
                            {children}
                        </Show>
                    </ResourceContextProvider>
                }
            />
            <Route
                path="*"
                element={<Navigate to="/books/1/show" replace={true} />}
            />
        </Routes>
    </AdminContext>
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

export const WithPath = () => (
    <Wrapper>
        <TabbedShowLayout>
            <TabbedShowLayout.Tab label="First">
                <TextField source="id" />
                <TextField source="title" />
            </TabbedShowLayout.Tab>
            <TabbedShowLayout.Tab label="Second" path="second">
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </TabbedShowLayout.Tab>
        </TabbedShowLayout>
    </Wrapper>
);
