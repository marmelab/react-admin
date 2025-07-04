import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import {
    Resource,
    useNotify,
    withLifecycleCallbacks,
    TestMemoryRouter,
    mergeTranslations,
    MutationMode,
    I18nProvider,
    memoryStore,
    ResourceContextProvider,
    RecordContextProvider,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { deepmerge } from '@mui/utils';
import { ThemeOptions } from '@mui/material';
import { UpdateButton } from './UpdateButton';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { NumberField, TextField } from '../field';
import { Show, SimpleShowLayout } from '../detail';
import { TopToolbar } from '../layout';
import { DataTable, List } from '../list';
import { LocalesMenuButton } from './LocalesMenuButton';
import { defaultLightTheme } from '../theme';

export default { title: 'ra-ui-materialui/button/UpdateButton' };

const defaultI18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? {
                  ...frenchMessages,
                  resources: {
                      books: {
                          name: 'Livre |||| Livres',
                          fields: {
                              id: 'Id',
                              title: 'Titre',
                              author: 'Auteur',
                              year: 'Année',
                          },
                      },
                  },
              }
            : englishMessages,
    'en' // Default locale
);

const customI18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? mergeTranslations(frenchMessages, {
                  resources: {
                      posts: {
                          action: {
                              update: 'Mettre les vues à zéro pour %{recordRepresentation}',
                          },
                          message: {
                              bulk_update_title:
                                  'Mettre les vues à zéro pour %{recordRepresentation} ?',
                              bulk_update_content:
                                  'Êtes-vous sûr de vouloir mettre les vues à zéro pour %{recordRepresentation} ?',
                          },
                      },
                  },
              })
            : mergeTranslations(englishMessages, {
                  resources: {
                      posts: {
                          action: {
                              update: 'Reset views for %{recordRepresentation}',
                          },
                          message: {
                              bulk_update_title:
                                  'Reset views for %{recordRepresentation}?',
                              bulk_update_content:
                                  'Are you sure you want to reset views for %{recordRepresentation}?',
                          },
                      },
                  },
              }),
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
);

const getDataProvider = () =>
    withLifecycleCallbacks(
        fakeRestDataProvider({
            posts: [
                {
                    id: 1,
                    title: 'Lorem Ipsum',
                    body: 'Lorem ipsum dolor sit amet',
                    views: 500,
                },
            ],
            authors: [],
        }),
        [
            {
                resource: 'posts',
                beforeUpdate: async params => {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return params;
                },
            },
        ]
    );

const PostShow = () => (
    <Show
        actions={
            <TopToolbar>
                <UpdateButton label="Reset views" data={{ views: 0 }} />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <NumberField source="views" />
        </SimpleShowLayout>
    </Show>
);

const PostList = () => (
    <List>
        <DataTable rowClick="show">
            <DataTable.Col source="id" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
            <DataTable.NumberCol source="views" />
            <DataTable.Col label="Reset views">
                <UpdateButton label="Reset views" data={{ views: 0 }} />
            </DataTable.Col>
        </DataTable>
    </List>
);

export const InsideAList = () => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource
                    name="posts"
                    list={<PostList />}
                    show={<PostShow />}
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const Undoable = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShow />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const PostShowPessimistic = () => (
    <Show
        actions={
            <TopToolbar>
                <UpdateButton
                    mutationMode="pessimistic"
                    label="Reset views"
                    data={{ views: 0 }}
                />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <NumberField source="views" />
        </SimpleShowLayout>
    </Show>
);

export const Pessimistic = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShowPessimistic />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const PostShowOptimistic = () => (
    <Show
        actions={
            <TopToolbar>
                <UpdateButton
                    mutationMode="optimistic"
                    label="Reset views"
                    data={{ views: 0 }}
                />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <NumberField source="views" />
        </SimpleShowLayout>
    </Show>
);

export const Optimistic = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShowOptimistic />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const PostShowMutationOptions = () => {
    const notify = useNotify();
    return (
        <Show
            actions={
                <TopToolbar>
                    <UpdateButton
                        mutationMode="pessimistic"
                        label="Reset views"
                        data={{ views: 0 }}
                        mutationOptions={{
                            onSuccess: () => {
                                notify('Reset views success');
                            },
                        }}
                    />
                </TopToolbar>
            }
        >
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="body" />
                <NumberField source="views" />
            </SimpleShowLayout>
        </Show>
    );
};

export const MutationOptions = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShowMutationOptions />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const PostShowSx = () => (
    <Show
        actions={
            <TopToolbar>
                <UpdateButton
                    sx={{ border: '1px solid red' }}
                    label="Reset views"
                    data={{ views: 0 }}
                />
            </TopToolbar>
        }
    >
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="body" />
            <NumberField source="views" />
        </SimpleShowLayout>
    </Show>
);

export const Sx = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShowSx />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const PostShowSideEffects = () => {
    const onSuccess = () => {
        alert('onSuccess');
    };
    const onError = () => {
        alert('onError');
    };
    return (
        <Show
            actions={
                <TopToolbar>
                    <UpdateButton
                        mutationOptions={{ onSuccess, onError }}
                        label="Reset views"
                        data={{ views: 0 }}
                    />
                </TopToolbar>
            }
        >
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="body" />
                <NumberField source="views" />
            </SimpleShowLayout>
        </Show>
    );
};

export const SideEffects = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShowSideEffects />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const Label = ({
    mutationMode = 'undoable',
    translations = 'default',
    i18nProvider = translations === 'default'
        ? defaultI18nProvider
        : customI18nProvider,
    label,
}: {
    mutationMode?: MutationMode;
    i18nProvider?: I18nProvider;
    translations?: 'default' | 'resource specific';
    label?: string;
}) => (
    <TestMemoryRouter>
        <AdminContext i18nProvider={i18nProvider} store={memoryStore()}>
            <ResourceContextProvider value="posts">
                <RecordContextProvider
                    value={{
                        id: 1,
                        title: 'Lorem Ipsum',
                        body: 'Lorem ipsum dolor sit amet',
                        views: 500,
                    }}
                >
                    <div>
                        <UpdateButton
                            label={label}
                            mutationMode={mutationMode}
                            data={{ views: 0 }}
                        />
                    </div>
                </RecordContextProvider>
                <LocalesMenuButton />
            </ResourceContextProvider>
        </AdminContext>
    </TestMemoryRouter>
);

Label.args = {
    mutationMode: 'undoable',
    translations: 'default',
};
Label.argTypes = {
    mutationMode: {
        options: ['undoable', 'optimistic', 'pessimistic'],
        control: { type: 'select' },
    },
    translations: {
        options: ['default', 'resource specific'],
        control: { type: 'radio' },
    },
};

export const Themed = () => (
    <TestMemoryRouter initialEntries={['/posts/1/show']}>
        <AdminContext
            dataProvider={getDataProvider()}
            i18nProvider={defaultI18nProvider}
            theme={deepmerge(defaultLightTheme, {
                components: {
                    RaUpdateButton: {
                        defaultProps: {
                            className: 'custom-class',
                            'data-testid': 'themed-button',
                        },
                    },
                },
            } as ThemeOptions)}
        >
            <AdminUI>
                <Resource name="posts" show={<PostShow />} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
