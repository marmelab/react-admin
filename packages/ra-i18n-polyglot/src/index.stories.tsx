import * as React from 'react';
import {
    Admin,
    EditGuesser,
    ListGuesser,
    Resource,
    TestMemoryRouter,
} from 'react-admin';
import polyglotI18nProvider from '.';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Translate, I18nContextProvider } from 'ra-core';

export default {
    title: 'ra-i18n-polyglot',
};

export const Basic = () => {
    const messages = {
        fr: frenchMessages,
        en: englishMessages,
    };

    const i18nProvider = polyglotI18nProvider(
        locale => messages[locale],
        'en',
        [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ]
    );

    return (
        <TestMemoryRouter>
            <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
                <Resource
                    name="posts"
                    list={<ListGuesser enableLog={false} />}
                    edit={<EditGuesser enableLog={false} />}
                />
                <Resource
                    name="comments"
                    list={<ListGuesser enableLog={false} />}
                    edit={<EditGuesser enableLog={false} />}
                />
            </Admin>
        </TestMemoryRouter>
    );
};

export const TranslateComponent = () => {
    const customMessages = {
        custom: {
            myKey: 'My Translated Key',
            myKeyWithArgs: 'Hello, %{myWorld}!',
        },
    };
    const messages = {
        fr: { ...frenchMessages, ...customMessages },
        en: { ...englishMessages, ...customMessages },
    };

    const i18nProvider = polyglotI18nProvider(
        locale => messages[locale],
        'en',
        [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ]
    );

    return (
        <I18nContextProvider value={i18nProvider}>
            <Translate i18nKey="custom.myKey" />
            <br />
            <Translate i18nKey="ra.page.dashboard" />
            <br />
            <Translate
                i18nKey="custom.myKeyWithArgs"
                args={{ myWorld: 'world' }}
            />
        </I18nContextProvider>
    );
};

const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});
