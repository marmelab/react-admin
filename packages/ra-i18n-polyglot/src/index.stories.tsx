import React from 'react';

import {
    Admin,
    EditGuesser,
    ListGuesser,
    Resource,
    TestMemoryRouter,
    TranslationMessages,
} from 'react-admin';
import polyglotI18nProvider from './';

import fakeRestDataProvider from 'ra-data-fakerest';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

const messages = {
    fr: frenchMessages,
    en: englishMessages,
};

export default {
    title: 'ra-i18n-polyglot',
};

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
    const [locale, setLocale] = React.useState('en');
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
    const i18nProvider = polyglotI18nProvider(getAsyncMessages, locale, [
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
