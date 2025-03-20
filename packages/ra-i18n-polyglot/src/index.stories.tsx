import React from 'react';
import { Translate, I18nContextProvider } from 'ra-core';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';

import polyglotI18nProvider from './';

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
                args={{ myWorld: 'world' }}
            />
            <br />
            <Translate i18nKey="custom.countBeer" args={{ smart_count: 2 }} />
        </I18nContextProvider>
    );
};
