import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createTheme, ThemeProvider, Typography } from '@mui/material';

import {
    ResourceContextProvider,
    DataProviderContext,
    I18nContextProvider,
    ListBase,
    ShowBase,
    TestMemoryRouter,
    NotificationContextProvider,
    UndoableMutationsContextProvider,
    required,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { InPlaceEditor } from './InPlaceEditor';
import { SelectInput } from '../SelectInput';
import { NumberInput } from '../NumberInput';
import { NumberField, SelectField, TextField } from '../../field';
import { Notification } from '../../layout';
import { DataTable } from '../../list/datatable';

export default {
    title: 'ra-ui-materialui/input/InPlaceEditor',
};

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

const Wrapper = ({
    children,
    dataProvider = fakeRestDataProvider(
        { users: [{ id: 1, name: 'John Doe', age: 25, type: 'customer' }] },
        process.env.NODE_ENV !== 'test',
        500
    ),
}) => (
    <TestMemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
            <DataProviderContext.Provider value={dataProvider}>
                <UndoableMutationsContextProvider>
                    <I18nContextProvider value={i18nProvider}>
                        <ThemeProvider theme={createTheme()}>
                            <NotificationContextProvider>
                                <ResourceContextProvider value="users">
                                    <ShowBase id={1}>{children}</ShowBase>
                                    <Notification />
                                </ResourceContextProvider>
                            </NotificationContextProvider>
                        </ThemeProvider>
                    </I18nContextProvider>
                </UndoableMutationsContextProvider>
            </DataProviderContext.Provider>
        </QueryClientProvider>
    </TestMemoryRouter>
);

export const Basic = ({
    delay,
    updateFails,
    mutationMode,
    notifyOnSuccess,
    showButtons,
}: {
    delay?: number;
    updateFails?: boolean;
    mutationMode?: 'optimistic' | 'pessimistic' | 'undoable';
    notifyOnSuccess?: boolean;
    showButtons?: boolean;
}) => {
    const dataProvider = fakeRestDataProvider(
        { users: [{ id: 1, name: 'John Doe', age: 25, type: 'customer' }] },
        process.env.NODE_ENV !== 'test'
    );
    const sometimesFailsDataProvider = {
        ...dataProvider,
        update: async (resource, params) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (updateFails) {
                        reject(new Error('Server error'));
                    } else {
                        resolve(dataProvider.update(resource, params));
                    }
                }, delay);
            }) as any;
        },
    };

    return (
        <Wrapper dataProvider={sometimesFailsDataProvider}>
            <Typography color="secondary">Text above</Typography>
            <InPlaceEditor
                source="name"
                mutationMode={mutationMode}
                notifyOnSuccess={notifyOnSuccess}
                showButtons={showButtons}
            />
            <Typography color="secondary">Text below</Typography>
        </Wrapper>
    );
};

Basic.args = {
    delay: 500,
    updateFails: false,
    mutationMode: 'pessimistic',
    notifyOnSuccess: false,
    showButtons: false,
};
Basic.argTypes = {
    delay: { control: { type: 'number' } },
    updateFails: { control: { type: 'boolean' } },
    mutationMode: {
        control: { type: 'select' },
        options: ['optimistic', 'pessimistic', 'undoable'],
    },
    notifyOnSuccess: { control: { type: 'boolean' } },
    showButtons: { control: { type: 'boolean' } },
};

export const Children = () => (
    <Wrapper>
        <InPlaceEditor source="age">
            <TextField source="age" variant="body1" />{' '}
            <Typography component="span">years old</Typography>
        </InPlaceEditor>
    </Wrapper>
);

export const Editor = () => (
    <Wrapper>
        <Typography color="secondary">Text above</Typography>
        <InPlaceEditor
            source="type"
            editor={
                <SelectInput
                    source="type"
                    choices={[
                        { id: 'prospect', name: 'Prospect' },
                        { id: 'customer', name: 'Customer' },
                    ]}
                    size="small"
                    margin="none"
                    label={false}
                    variant="standard"
                    autoFocus
                    SelectProps={{ defaultOpen: true }}
                    helperText={false}
                    sx={{ '& .MuiInput-root': { marginTop: 0 } }}
                />
            }
        >
            <SelectField
                source="type"
                choices={[
                    { id: 'prospect', name: 'Prospect' },
                    { id: 'customer', name: 'Customer' },
                ]}
                variant="body1"
                sx={{ marginTop: '1px', marginBottom: '5px' }}
                component="div"
            />
        </InPlaceEditor>
        <Typography color="secondary">Text below</Typography>
    </Wrapper>
);

export const CancelOnBlur = () => (
    <Wrapper>
        <InPlaceEditor source="name" cancelOnBlur />
    </Wrapper>
);

export const MutationMode = () => (
    <Wrapper>
        <InPlaceEditor source="name" mutationMode="optimistic" />
    </Wrapper>
);

export const NotifyOnSuccess = () => (
    <Wrapper>
        <InPlaceEditor source="name" notifyOnSuccess />
    </Wrapper>
);

export const ShowButtons = () => (
    <Wrapper>
        <InPlaceEditor source="name" showButtons />
    </Wrapper>
);

export const MutationOptions = () => (
    <Wrapper>
        <InPlaceEditor
            source="name"
            mutationOptions={{ meta: { foo: 'bar' } }}
        />
    </Wrapper>
);

export const SX = () => (
    <Wrapper>
        <InPlaceEditor
            source="name"
            sx={{
                marginTop: '1rem',
                marginLeft: '1rem',
                '& .RaInPlaceEditor-reading div': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'primary.main',
                },
                '& .RaInPlaceEditor-saving div': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'text.disabled',
                },
                '& .RaInPlaceEditor-editing input': {
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'primary.main',
                },
            }}
        />
    </Wrapper>
);

export const EditableDataTable = () => (
    <TestMemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
            <DataProviderContext.Provider
                value={fakeRestDataProvider(
                    {
                        users: [
                            {
                                id: 1,
                                name: 'John Doe',
                                age: 25,
                                type: 'customer',
                            },
                            {
                                id: 2,
                                name: 'James Smith',
                                age: 30,
                                type: 'prospect',
                            },
                            {
                                id: 3,
                                name: 'Bill Dennison',
                                age: 35,
                                type: 'customer',
                            },
                        ],
                    },
                    process.env.NODE_ENV !== 'test',
                    500
                )}
            >
                <UndoableMutationsContextProvider>
                    <I18nContextProvider value={i18nProvider}>
                        <ThemeProvider theme={createTheme()}>
                            <NotificationContextProvider>
                                <ResourceContextProvider value="users">
                                    <ListBase>
                                        <DataTable>
                                            <DataTable.Col source="id" />
                                            <DataTable.Col source="name">
                                                <InPlaceEditor
                                                    source="name"
                                                    sx={{
                                                        '& .RaInPlaceEditor-reading div':
                                                            {
                                                                fontSize: 14,
                                                            },
                                                        '& .RaInPlaceEditor-saving div':
                                                            {
                                                                fontSize: 14,
                                                            },
                                                        '& .RaInPlaceEditor-editing input':
                                                            {
                                                                fontSize: 14,
                                                            },
                                                    }}
                                                />
                                            </DataTable.Col>
                                            <DataTable.Col source="age">
                                                <InPlaceEditor
                                                    source="age"
                                                    editor={
                                                        <NumberInput
                                                            source="age"
                                                            size="small"
                                                            margin="none"
                                                            label={false}
                                                            variant="standard"
                                                            autoFocus
                                                            helperText={false}
                                                            sx={{
                                                                width: 50,
                                                                '& .MuiInputBase-root':
                                                                    {
                                                                        marginTop: 0,
                                                                    },
                                                                '& input': {
                                                                    fontSize: 14,
                                                                },
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <NumberField source="age" />
                                                </InPlaceEditor>
                                            </DataTable.Col>
                                            <DataTable.Col source="type">
                                                <InPlaceEditor
                                                    source="type"
                                                    editor={
                                                        <SelectInput
                                                            source="type"
                                                            choices={[
                                                                {
                                                                    id: 'prospect',
                                                                    name: 'Prospect',
                                                                },
                                                                {
                                                                    id: 'customer',
                                                                    name: 'Customer',
                                                                },
                                                            ]}
                                                            size="small"
                                                            margin="none"
                                                            label={false}
                                                            variant="standard"
                                                            validate={required()}
                                                            autoFocus
                                                            SelectProps={{
                                                                defaultOpen:
                                                                    true,
                                                            }}
                                                            helperText={false}
                                                            sx={{
                                                                width: 50,
                                                                '& .MuiInputBase-root':
                                                                    {
                                                                        marginTop: 0,
                                                                        fontSize: 14,
                                                                    },
                                                            }}
                                                        />
                                                    }
                                                >
                                                    <SelectField
                                                        source="type"
                                                        choices={[
                                                            {
                                                                id: 'prospect',
                                                                name: 'Prospect',
                                                            },
                                                            {
                                                                id: 'customer',
                                                                name: 'Customer',
                                                            },
                                                        ]}
                                                        component="div"
                                                    />
                                                </InPlaceEditor>
                                            </DataTable.Col>
                                        </DataTable>
                                    </ListBase>
                                    <Notification />
                                </ResourceContextProvider>
                            </NotificationContextProvider>
                        </ThemeProvider>
                    </I18nContextProvider>
                </UndoableMutationsContextProvider>
            </DataProviderContext.Provider>
        </QueryClientProvider>
    </TestMemoryRouter>
);
