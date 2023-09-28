import * as React from 'react';
import { Admin, EditGuesser, ListGuesser, Resource } from 'react-admin';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import i18nextProvider, { convertRaMessagesToI18next } from './index';

export default {
    title: 'ra-i18n-18next',
};

export const Basic = () => {
    const instance = i18n.use(initReactI18next);
    const i18nProvider = i18nextProvider(instance, {
        resources: {
            en: { translation: convertRaMessagesToI18next(englishMessages) },
        },
    });
    return (
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
            <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
        </Admin>
    );
};

export const WithCustomTranslations = () => {
    const instance = i18n.use(initReactI18next);
    const i18nProvider = i18nextProvider(instance, {
        resources: {
            en: {
                translation: {
                    ...convertRaMessagesToI18next(englishMessages),
                    resources: {
                        posts: {
                            name_one: 'Blog post',
                            name_other: 'Blog posts',
                            fields: {
                                title: 'Title',
                            },
                        },
                    },
                },
            },
        },
    });
    return (
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
            <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
        </Admin>
    );
};
export const WithCustomOptions = () => {
    const instance = i18n.use(initReactI18next);
    const defaultMessages = convertRaMessagesToI18next(englishMessages, {
        prefix: '#{',
        suffix: '}#',
    });

    const i18nProvider = i18nextProvider(instance, {
        interpolation: {
            prefix: '#{',
            suffix: '}#',
        },
        resources: {
            en: {
                translation: {
                    ...defaultMessages,
                    resources: {
                        posts: {
                            name_one: 'Blog post',
                            name_other: 'Blog posts',
                            fields: {
                                title: 'Title',
                            },
                        },
                    },
                },
            },
        },
    });
    return (
        <Admin dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
            <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
        </Admin>
    );
};

const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});
