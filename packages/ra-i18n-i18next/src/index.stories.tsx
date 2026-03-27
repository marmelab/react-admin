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
import frenchMessages from 'ra-language-french';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Translate, I18nContextProvider, useI18nProvider } from 'ra-core';
import { useI18nextProvider, convertRaTranslationsToI18next } from './index';

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

export const TranslateWithReactElement = () => {
    const i18nProvider = useI18nextProvider({
        options: {
            resources: {
                en: {
                    translation: convertRaTranslationsToI18next({
                        ...englishMessages,
                        custom: {
                            welcome: 'Hello, %{name}! Welcome to %{place}.',
                        },
                    }),
                },
                fr: {
                    translation: convertRaTranslationsToI18next({
                        ...frenchMessages,
                        custom: {
                            welcome: 'Bonjour, %{name}! Bienvenue à %{place}.',
                        },
                    }),
                },
            },
        },
        availableLocales: [
            { locale: 'en', name: 'English' },
            { locale: 'fr', name: 'Français' },
        ],
    });

    if (!i18nProvider) return null;

    return (
        <I18nContextProvider value={i18nProvider}>
            <TranslateWithReactElementContent />
        </I18nContextProvider>
    );
};

const TranslateWithReactElementContent = () => {
    const i18nProvider = useI18nProvider();
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    const handleLocaleChange = async (locale: string) => {
        await i18nProvider.changeLocale(locale);
        forceUpdate();
    };

    return (
        <div>
            <div>
                <button onClick={() => handleLocaleChange('en')}>
                    English
                </button>
                <button onClick={() => handleLocaleChange('fr')}>
                    Français
                </button>
            </div>
            <br />
            <Translate
                i18nKey="custom.welcome"
                options={{
                    name: <strong>John</strong>,
                    place: <em>react-admin</em>,
                }}
            />
        </div>
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
                            helloWorld: 'Hello, %{myWorld}!',
                            countBeer: 'One beer |||| %{smart_count} beers',
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

const dataProvider = fakeRestDataProvider({
    posts: [{ id: 1, title: 'Lorem Ipsum' }],
    comments: [{ id: 1, body: 'Sic dolor amet...' }],
});
