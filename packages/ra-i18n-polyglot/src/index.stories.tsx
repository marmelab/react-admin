import React from 'react';
import {
    Admin,
    EditGuesser,
    ListGuesser,
    Resource,
    TestMemoryRouter,
    TranslationMessages,
} from 'react-admin';
import { Translate, I18nContextProvider } from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

import polyglotI18nProvider from './';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};

export default { title: 'ra-i18n-polyglot' };

export const Basic = () => {
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
            <Admin i18nProvider={i18nProvider} dataProvider={dataProvider}>
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

export const AsynchronousLocaleChange = () => {
    const getAsyncMessages = locale => {
        if (locale === 'en') {
            // initial call, must return synchronously
            return englishMessages;
        }
        return new Promise<TranslationMessages>(resolve => {
            setTimeout(() => {
                resolve(messages[locale]);
            }, 1000);
        });
    };
    const i18nProvider = polyglotI18nProvider(getAsyncMessages, 'en', [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]);

    return (
        <TestMemoryRouter>
            <Admin i18nProvider={i18nProvider} dataProvider={dataProvider}>
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
const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});

export const TranslateComponent = () => {
    const customMessages = {
        custom: {
            myKey: 'My Translated Key',
            helloWorld: 'Hello, %{myWorld}!',
            countBeer: 'One beer |||| %{smart_count} beers',
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
                i18nKey="custom.helloWorld"
                options={{ myWorld: 'world' }}
            />
            <br />
            <Translate
                i18nKey="custom.countBeer"
                options={{ smart_count: 2 }}
            />
        </I18nContextProvider>
    );
};
