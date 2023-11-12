import * as React from 'react';
import { Admin, EditGuesser, ListGuesser, Resource } from 'react-admin';
import { defaultDarkTheme } from '../../ra-ui-materialui/src/theme/defaultTheme';
import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import englishMessages from 'ra-language-english';
import fakeRestDataProvider from 'ra-data-fakerest';
import { MemoryRouter } from 'react-router-dom';
import { useI18nextProvider } from './index';
import { convertRaTranslationsToI18next } from './convertRaTranslationsToI18next';

export default {
    title: 'ra-i18n-i18next',
};

export const Basic = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                en: {
                    translation: convertRaTranslationsToI18next(
                        englishMessages
                    ),
                },
            },
        },
    });

    if (!i18nProvider) return null;

    return (
        <MemoryRouter>
            <Admin
                darkTheme={defaultDarkTheme}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
            >
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
        </MemoryRouter>
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
        <MemoryRouter>
            <Admin
                darkTheme={defaultDarkTheme}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
            >
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
        </MemoryRouter>
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
        <MemoryRouter>
            <Admin
                darkTheme={defaultDarkTheme}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
            >
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
        </MemoryRouter>
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
        <MemoryRouter>
            <Admin
                darkTheme={defaultDarkTheme}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
            >
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
        </MemoryRouter>
    );
};

const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});
