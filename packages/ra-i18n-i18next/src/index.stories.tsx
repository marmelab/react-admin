import * as React from 'react';
import { Admin, EditGuesser, ListGuesser, Resource } from 'react-admin';
import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { useI18nextProvider, convertRaMessagesToI18next } from './index';

export default {
    title: 'ra-i18n-18next',
};

export const Basic = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                en: {
                    translation: convertRaMessagesToI18next(englishMessages),
                },
            },
        },
    });

    if (!i18nProvider) return null;

    return (
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
    );
};

export const WithLazyLoadedLanguages = () => {
    const i18nInstance = i18n.use(
        resourcesToBackend(language => {
            if (language === 'fr') {
                return import(
                    `ra-language-french`
                ).then(({ default: messages }) =>
                    convertRaMessagesToI18next(messages)
                );
            }
            return import(`ra-language-english`).then(({ default: messages }) =>
                convertRaMessagesToI18next(messages)
            );
        })
    );

    const i18nProvider = useI18nextProvider({
        i18nInstance,
        availableLocales: [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'French' },
        ],
    });

    if (!i18nProvider) return null;

    return (
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
    );
};

export const WithCustomTranslations = () => {
    const i18nProvider = useI18nextProvider({
        options: {
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
        },
    });

    if (!i18nProvider) return null;

    return (
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
    );
};

export const WithCustomOptions = () => {
    const defaultMessages = convertRaMessagesToI18next(englishMessages, {
        prefix: '#{',
        suffix: '}#',
    });

    const i18nProvider = useI18nextProvider({
        options: {
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
        },
    });

    if (!i18nProvider) return null;

    return (
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
    );
};

const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});
