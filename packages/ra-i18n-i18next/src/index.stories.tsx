import * as React from 'react';
import {
    Admin,
    EditGuesser,
    ListGuesser,
    Resource,
    TestMemoryRouter,
} from 'react-admin';
import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Translate, I18nContextProvider } from 'ra-core';
import { useI18nextProvider, convertRaTranslationsToI18next } from '..';

export default {
    title: 'ra-i18n-i18next',
};

export const Basic = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                en: {
                    translation:
                        convertRaTranslationsToI18next(englishMessages),
                },
            },
        },
    });

    if (!i18nProvider) return null;

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

export const WithLazyLoadedLanguages = () => {
    const i18nextInstance = i18n.use(
        resourcesToBackend(language => {
            if (language === 'fr') {
                return import(`./stories-fr`).then(({ default: messages }) =>
                    convertRaTranslationsToI18next(messages)
                );
            }
            return import(`./stories-en`).then(({ default: messages }) =>
                convertRaTranslationsToI18next(messages)
            );
        })
    );

    const i18nProvider = useI18nextProvider({
        i18nextInstance,
        availableLocales: [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'French' },
        ],
    });

    if (!i18nProvider) return null;

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

export const WithCustomTranslations = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                en: {
                    translation: {
                        ...convertRaTranslationsToI18next(englishMessages),
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

export const WithCustomOptions = () => {
    const defaultMessages = convertRaTranslationsToI18next(englishMessages, {
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
                    translation: defaultMessages,
                },
            },
        },
    });

    if (!i18nProvider) return null;

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
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                en: {
                    translation: convertRaTranslationsToI18next({
                        ...englishMessages,
                        custom: {
                            myKey: 'My Translated Key',
                            myKeyWithArgs: 'It cost %{price}.00 $',
                        },
                    }),
                },
            },
        },
    });

    if (!i18nProvider) return null;

    return (
        <I18nContextProvider value={i18nProvider}>
            <Translate i18nKey="custom.myKey" />
            <br />
            <Translate i18nKey="ra.action.add" />
            <br />
            <Translate i18nKey="custom.myKeyWithArgs" args={{ price: '6' }} />
        </I18nContextProvider>
    );
};

const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});
