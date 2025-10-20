import * as React from 'react';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    AuthProvider,
    CoreAdminContext,
    ShowBase,
    ShowBaseProps,
    DataProvider,
    mergeTranslations,
    I18nProvider,
    useShowContext,
    useLocaleState,
    IsOffline,
    WithRecord,
    GetOneResult,
    Resource,
    CoreAdmin,
    TestMemoryRouter,
} from '../..';
import { onlineManager } from '@tanstack/react-query';

export default {
    title: 'ra-core/controller/ShowBase',
};

const defaultI18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? mergeTranslations(frenchMessages, {
                  resources: {
                      posts: {
                          name: 'Article |||| Articles',
                      },
                  },
              })
            : englishMessages,
    'en'
);

const customI18nProvider = polyglotI18nProvider(
    locale =>
        locale === 'fr'
            ? mergeTranslations(frenchMessages, {
                  resources: {
                      posts: {
                          page: {
                              show: "Détails de l'article %{recordRepresentation}",
                          },
                      },
                  },
              })
            : mergeTranslations(englishMessages, {
                  resources: {
                      posts: {
                          page: {
                              show: 'Details of article %{recordRepresentation}',
                          },
                      },
                  },
              }),
    'en'
);

export const DefaultTitle = ({
    translations = 'default',
    i18nProvider = translations === 'default'
        ? defaultI18nProvider
        : customI18nProvider,
}: {
    i18nProvider?: I18nProvider;
    translations?: 'default' | 'resource specific';
}) => (
    <CoreAdminContext
        dataProvider={defaultDataProvider}
        i18nProvider={i18nProvider}
    >
        <ShowBase {...defaultProps}>
            <Title />
        </ShowBase>
    </CoreAdminContext>
);

DefaultTitle.args = {
    translations: 'default',
};
DefaultTitle.argTypes = {
    translations: {
        options: ['default', 'resource specific'],
        control: { type: 'radio' },
    },
};

export const NoAuthProvider = ({
    dataProvider = defaultDataProvider,
    ...props
}: {
    dataProvider?: DataProvider;
} & Partial<ShowBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ShowBase {...defaultProps} {...props}>
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

export const WithAuthProviderNoAccessControl = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
    },
    dataProvider = defaultDataProvider,
    ShowProps,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
    ShowProps?: Partial<ShowBaseProps>;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <ShowBase
            {...defaultProps}
            {...ShowProps}
            authLoading={<div>Authentication loading...</div>}
        >
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

export const AccessControl = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
        canAccess: () => new Promise(resolve => setTimeout(resolve, 300, true)),
    },
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <ShowBase
            {...defaultProps}
            authLoading={<div>Authentication loading...</div>}
        >
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

export const Loading = () => {
    let resolveGetOne: (() => void) | null = null;
    const dataProvider = {
        ...defaultDataProvider,
        getOne: (resource, params) => {
            return new Promise<GetOneResult>(resolve => {
                resolveGetOne = () =>
                    resolve(defaultDataProvider.getOne(resource, params));
            });
        },
    };

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <button
                onClick={() => {
                    resolveGetOne && resolveGetOne();
                }}
            >
                Resolve loading
            </button>
            <ShowBase {...defaultProps} loading={<div>Loading data...</div>}>
                <Child />
            </ShowBase>
        </CoreAdminContext>
    );
};

export const FetchError = () => {
    let rejectGetOne: (() => void) | null = null;
    const dataProvider = {
        ...defaultDataProvider,
        getOne: () => {
            return new Promise<GetOneResult>((_, reject) => {
                rejectGetOne = () => reject(new Error('Expected error.'));
            });
        },
    };

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <button
                onClick={() => {
                    rejectGetOne && rejectGetOne();
                }}
            >
                Reject loading
            </button>
            <ShowBase {...defaultProps} error={<p>Something went wrong.</p>}>
                <Child />
            </ShowBase>
        </CoreAdminContext>
    );
};

export const RedirectOnError = () => {
    let rejectGetOne: (() => void) | null = null;
    const dataProvider = {
        ...defaultDataProvider,
        getOne: () => {
            return new Promise<GetOneResult>((_, reject) => {
                rejectGetOne = () => reject(new Error('Expected error.'));
            });
        },
    };

    return (
        <TestMemoryRouter initialEntries={['/posts/12/show']}>
            <CoreAdmin dataProvider={dataProvider}>
                <Resource
                    name="posts"
                    list={<p>List view</p>}
                    show={
                        <>
                            <button
                                onClick={() => {
                                    rejectGetOne && rejectGetOne();
                                }}
                            >
                                Reject loading
                            </button>
                            <ShowBase {...defaultProps}>
                                <Child />
                            </ShowBase>
                        </>
                    }
                />
            </CoreAdmin>
        </TestMemoryRouter>
    );
};

export const WithRenderProp = ({
    dataProvider = defaultDataProvider,
    ...props
}: {
    dataProvider?: DataProvider;
} & Partial<ShowBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ShowBase
            {...defaultProps}
            {...props}
            render={({ record }) => {
                return <p>{record?.test}</p>;
            }}
        />
    </CoreAdminContext>
);

export const Offline = ({
    dataProvider = defaultDataProvider,
    isOnline = true,
    ...props
}: {
    dataProvider?: DataProvider;
    isOnline?: boolean;
} & Partial<ShowBaseProps>) => {
    React.useEffect(() => {
        onlineManager.setOnline(isOnline);
    }, [isOnline]);
    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <ShowBase
                {...defaultProps}
                {...props}
                offline={
                    <p style={{ color: 'orange' }}>
                        You are offline, cannot load data
                    </p>
                }
            >
                <OfflineChild />
            </ShowBase>
        </CoreAdminContext>
    );
};

Offline.args = {
    isOnline: true,
};

Offline.argTypes = {
    isOnline: {
        control: { type: 'boolean' },
    },
};

const defaultDataProvider = fakeRestDataProvider(
    {
        posts: [
            { id: 12, test: 'Hello', title: 'Hello' },
            { id: 13, test: 'World', title: 'World' },
        ],
    },
    process.env.NODE_ENV !== 'test',
    process.env.NODE_ENV !== 'test' ? 300 : 0
);

const defaultProps = {
    id: 12,
    resource: 'posts',
};

const Child = () => {
    return <WithRecord render={record => <p>{record?.test}</p>} />;
};

const OfflineChild = () => {
    return (
        <>
            <p>Use the story controls to simulate offline mode:</p>
            <IsOffline>
                <p style={{ color: 'orange' }}>
                    You are offline, the data may be outdated
                </p>
            </IsOffline>
            <WithRecord render={record => <p>{record?.test}</p>} />
        </>
    );
};

const Title = () => {
    const { defaultTitle } = useShowContext();
    const [locale, setLocale] = useLocaleState();
    return (
        <div>
            <strong>
                {defaultTitle} ({locale})
            </strong>
            <div>
                <button onClick={() => setLocale('en')}>EN</button>
                <button onClick={() => setLocale('fr')}>FR</button>
            </div>
        </div>
    );
};
