import * as React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { createTheme, ThemeProvider, Typography } from '@mui/material';
import {
    ResourceContextProvider,
    DataProviderContext,
    I18nContextProvider,
    ShowBase,
    TestMemoryRouter,
    NotificationContextProvider,
    UndoableMutationsContextProvider,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { InPlaceEditor } from './InPlaceEditor';
import { SelectInput } from '../SelectInput';
import { SelectField, TextField } from '../../field';
import { Notification } from '../../layout';

export default {
    title: 'ra-ui-materialui/input/InPlaceEditor',
};

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

const Wrapper = ({ children, dataProvider }) => (
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
}) => {
    const dataProvider = fakeRestDataProvider(
        {
            users: [
                { id: 1, name: 'John Doe', age: 25 },
                { id: 2, name: 'Jane Doe', age: 30 },
            ],
        },
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
};
Basic.argTypes = {
    delay: { control: { type: 'number' } },
    updateFails: { control: { type: 'boolean' } },
    mutationMode: {
        control: { type: 'select' },
        options: ['optimistic', 'pessimistic', 'undoable'],
    },
    notifyOnSuccess: { control: { type: 'boolean' } },
};

export const SX = () => {
    const dataProvider = fakeRestDataProvider(
        {
            users: [{ id: 1, name: 'John Doe', age: 25 }],
        },
        process.env.NODE_ENV !== 'test'
    );
    return (
        <Wrapper dataProvider={dataProvider}>
            <InPlaceEditor
                source="name"
                sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: 'primary.main',
                    marginTop: '1rem',
                    marginLeft: '1rem',
                }}
            />
        </Wrapper>
    );
};

export const Children = () => {
    const dataProvider = fakeRestDataProvider(
        {
            users: [{ id: 1, name: 'John Doe', age: 25 }],
        },
        process.env.NODE_ENV !== 'test'
    );
    return (
        <Wrapper dataProvider={dataProvider}>
            <InPlaceEditor source="age">
                <TextField source="age" variant="body1" />{' '}
                <Typography component="span">years old</Typography>
            </InPlaceEditor>
        </Wrapper>
    );
};

export const Editor = () => {
    const dataProvider = fakeRestDataProvider(
        {
            users: [{ id: 1, name: 'John Doe', type: 'prospect' }],
        },
        process.env.NODE_ENV !== 'test'
    );
    return (
        <Wrapper dataProvider={dataProvider}>
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
                    sx={{ marginTop: '1px' }}
                    component="div"
                />
            </InPlaceEditor>
        </Wrapper>
    );
};
