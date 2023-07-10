import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import { Resource, withLifecycleCallbacks } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import { createMemoryHistory } from 'history';

import { UpdateButton } from './UpdateButton';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { NumberField, TextField } from '../field';
import { Show, SimpleShowLayout } from '../detail';
import { TopToolbar } from '../layout';

export default { title: 'ra-ui-materialui/button/UpdateButton' };

const i18nProvider = polyglotI18nProvider(
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

const getDataProvider = () =>
    withLifecycleCallbacks(
        fakeRestDataProvider({
            posts: [
                {
                    id: 1,
                    title: 'Lorem Ipsum',
                    body: 'Lorem ipsum dolor sit amet',
                    views: 1000,
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

const PostShow = () => {
    return (
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
};

export const Undoable = () => (
    <AdminContext
        dataProvider={getDataProvider()}
        i18nProvider={i18nProvider}
        history={createMemoryHistory({ initialEntries: ['/posts/1/show'] })}
    >
        <AdminUI>
            <Resource name="posts" show={<PostShow />} />
        </AdminUI>
    </AdminContext>
);

const PostShowPessimistic = () => {
    return (
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
};

export const Pessimistic = () => (
    <AdminContext
        dataProvider={getDataProvider()}
        i18nProvider={i18nProvider}
        history={createMemoryHistory({ initialEntries: ['/posts/1/show'] })}
    >
        <AdminUI>
            <Resource name="posts" show={<PostShowPessimistic />} />
        </AdminUI>
    </AdminContext>
);

const PostShowOptimistic = () => {
    return (
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
};

export const Optimistic = () => (
    <AdminContext
        dataProvider={getDataProvider()}
        i18nProvider={i18nProvider}
        history={createMemoryHistory({ initialEntries: ['/posts/1/show'] })}
    >
        <AdminUI>
            <Resource name="posts" show={<PostShowOptimistic />} />
        </AdminUI>
    </AdminContext>
);

const PostShowSx = () => {
    return (
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
};

export const Sx = () => (
    <AdminContext
        dataProvider={getDataProvider()}
        i18nProvider={i18nProvider}
        history={createMemoryHistory({ initialEntries: ['/posts/1/show'] })}
    >
        <AdminUI>
            <Resource name="posts" show={<PostShowSx />} />
        </AdminUI>
    </AdminContext>
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
    <AdminContext
        dataProvider={getDataProvider()}
        i18nProvider={i18nProvider}
        history={createMemoryHistory({ initialEntries: ['/posts/1/show'] })}
    >
        <AdminUI>
            <Resource name="posts" show={<PostShowSideEffects />} />
        </AdminUI>
    </AdminContext>
);
