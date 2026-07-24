import * as React from 'react';
import {
    RaRecord,
    required,
    ResourceContextProvider,
    testDataProvider,
    TestMemoryRouter,
} from 'ra-core';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { AdminContext } from '../AdminContext';
import { Edit } from '../detail';
import { NumberInput, TextInput } from '../input';
import { TabbedForm } from './TabbedForm';
import { Stack } from '@mui/material';
import { Route, Routes } from 'react-router';

export default { title: 'ra-ui-materialui/forms/TabbedForm' };

const data = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    bio: 'Leo Tolstoy (1828-1910) was a Russian writer who is regarded as one of the greatest authors of all time. He received nominations for the Nobel Prize in Literature every year from 1902 to 1906 and for the Nobel Peace Prize in 1901, 1902, and 1909.',
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
        initialEntries={[`/books/${encodeURIComponent(record.id)}`]}
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
                        path="/books/:id/*"
                        element={<Edit sx={{ width: 600 }}>{children}</Edit>}
                    />
                </Routes>
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

export const Basic = () => (
    <Wrapper>
        <TabbedForm>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" />
                <NumberInput source="year" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

export const MultipleTabs = ({ tabs }) => (
    <Wrapper>
        <TabbedForm tabs={tabs}>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" />
                <NumberInput source="year" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="details">
                <TextInput multiline source="bio" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

export const CustomLayout = () => (
    <Wrapper>
        <TabbedForm>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <Stack direction="row" gap={1} width="100%">
                    <TextInput source="author" sx={{ width: '50%' }} />
                    <NumberInput source="year" sx={{ width: '50%' }} />
                </Stack>
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

export const NoToolbar = () => (
    <Wrapper>
        <TabbedForm toolbar={false}>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" sx={{ width: '50%' }} />
                <NumberInput source="year" sx={{ width: '50%' }} />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

export const Count = () => (
    <Wrapper>
        <TabbedForm>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" />
                <NumberInput source="year" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="comments" count={3}>
                <TextInput multiline source="bio" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <TabbedForm validate={() => ({ bio: 'incorrect details' })}>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" />
                <NumberInput source="year" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="details">
                <TextInput multiline source="bio" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

const zodSchema = z.object({
    title: z.string().min(5),
    author: z.string().min(5),
    bio: z.string().min(5),
});

export const Resolver = () => (
    <Wrapper>
        <TabbedForm resolver={zodResolver(zodSchema)}>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" />
                <NumberInput source="year" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="details">
                <TextInput multiline source="bio" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

const dataWithEncodedId = {
    id: '1:prod:resource1',
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    bio: 'Leo Tolstoy (1828-1910) was a Russian writer who is regarded as one of the greatest authors of all time. He received nominations for the Nobel Prize in Literature every year from 1902 to 1906 and for the Nobel Peace Prize in 1901, 1902, and 1909.',
    year: 1869,
};
export const EncodedPaths = () => (
    <Wrapper record={dataWithEncodedId}>
        <TabbedForm>
            <TabbedForm.Tab label="main">
                <TextInput source="title" />
                <TextInput source="author" />
                <NumberInput source="year" />
            </TabbedForm.Tab>
            <TabbedForm.Tab label="details">
                <TextInput multiline source="bio" />
            </TabbedForm.Tab>
        </TabbedForm>
    </Wrapper>
);

// https://github.com/marmelab/react-admin/issues/11290
// Submitting this form (with the fields empty) used to throw
// "Maximum update depth exceeded" because each per-tab FormGroup re-rendered
// on every per-field validation toggle. Click SAVE to check it no longer does.
export const ManyRequiredInputs = () => (
    <Wrapper record={{ id: 1 }}>
        <TabbedForm>
            {Array.from({ length: 6 }, (_, tab) => (
                <TabbedForm.Tab key={tab} label={`tab ${tab + 1}`}>
                    {Array.from({ length: 8 }, (_, field) => (
                        <TextInput
                            key={`field_${tab}_${field}`}
                            source={`field_${tab}_${field}`}
                            validate={required()}
                        />
                    ))}
                </TabbedForm.Tab>
            ))}
        </TabbedForm>
    </Wrapper>
);
