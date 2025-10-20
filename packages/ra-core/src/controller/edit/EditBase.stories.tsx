import * as React from 'react';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    AuthProvider,
    CoreAdminContext,
    EditBase,
    EditBaseProps,
    DataProvider,
    SaveHandlerCallbacks,
    useSaveContext,
    I18nProvider,
    mergeTranslations,
    useEditContext,
    useLocaleState,
    MutationMode,
    WithRecord,
    IsOffline,
    GetOneResult,
    TestMemoryRouter,
    CoreAdmin,
    Resource,
} from '../..';
import { onlineManager, useMutationState } from '@tanstack/react-query';

export default {
    title: 'ra-core/controller/EditBase',
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
                              edit: "Modifier l'article %{recordRepresentation}",
                          },
                      },
                  },
              })
            : mergeTranslations(englishMessages, {
                  resources: {
                      posts: {
                          page: {
                              edit: 'Update article %{recordRepresentation}',
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
        <EditBase {...defaultProps}>
            <Title />
        </EditBase>
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
    callTimeOptions,
    ...props
}: {
    dataProvider?: DataProvider;
    callTimeOptions?: SaveHandlerCallbacks;
} & Partial<EditBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <EditBase {...defaultProps} {...props}>
            <Child callTimeOptions={callTimeOptions} />
        </EditBase>
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
    EditProps,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
    EditProps?: Partial<EditBaseProps>;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <EditBase
            {...defaultProps}
            {...EditProps}
            authLoading={<div>Authentication loading...</div>}
        >
            <Child />
        </EditBase>
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
        <EditBase
            {...defaultProps}
            authLoading={<div>Authentication loading...</div>}
        >
            <Child />
        </EditBase>
    </CoreAdminContext>
);

export const WithRenderProps = ({
    dataProvider = defaultDataProvider,
    mutationMode = 'optimistic',
}: {
    dataProvider?: DataProvider;
    mutationMode?: MutationMode;
}) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <EditBase
            mutationMode={mutationMode}
            {...defaultProps}
            render={({ record, save }) => {
                const handleClick = () => {
                    if (!save) return;

                    save({ test: 'test' });
                };
                return (
                    <>
                        <p>{record?.id}</p>
                        <p>{record?.test}</p>
                        <button onClick={handleClick}>save</button>
                    </>
                );
            }}
        />
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
            <EditBase {...defaultProps} loading={<div>Loading data...</div>}>
                <Child />
            </EditBase>
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
            <EditBase {...defaultProps} error={<p>Something went wrong.</p>}>
                <Child />
            </EditBase>
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
                            <EditBase {...defaultProps}>
                                <Child />
                            </EditBase>
                        </>
                    }
                />
            </CoreAdmin>
        </TestMemoryRouter>
    );
};

export const Offline = ({
    dataProvider = defaultDataProvider,
    isOnline = true,
    ...props
}: {
    dataProvider?: DataProvider;
    isOnline?: boolean;
} & Partial<EditBaseProps>) => {
    React.useEffect(() => {
        onlineManager.setOnline(isOnline);
    }, [isOnline]);
    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <EditBase
                {...defaultProps}
                {...props}
                mutationMode="pessimistic"
                offline={
                    <p style={{ color: 'orange' }}>
                        You are offline, cannot load data
                    </p>
                }
            >
                <OfflineChild />
            </EditBase>
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

const Child = ({
    callTimeOptions,
}: {
    callTimeOptions?: SaveHandlerCallbacks;
}) => {
    const saveContext = useSaveContext();

    const handleClick = () => {
        if (!saveContext || !saveContext.save) return;
        saveContext.save({ test: 'test' }, callTimeOptions);
    };

    return (
        <>
            <WithRecord render={record => <p>{record?.test}</p>} />
            <button onClick={handleClick}>save</button>
        </>
    );
};

const OfflineChild = ({
    callTimeOptions,
}: {
    callTimeOptions?: SaveHandlerCallbacks;
}) => {
    const saveContext = useSaveContext();
    const { saving } = useEditContext();

    const handleClick = () => {
        if (!saveContext || !saveContext.save) return;
        saveContext.save({ test: 'test' }, callTimeOptions);
    };

    return (
        <>
            <p>Use the story controls to simulate offline mode:</p>
            <IsOffline>
                <p style={{ color: 'orange' }}>
                    You are offline, the data may be outdated
                </p>
            </IsOffline>
            <WithRecord render={record => <p>{record?.test}</p>} />
            <button onClick={handleClick}>
                {saving ? 'Saving...' : 'Save'}
            </button>
            <MutationsState />
        </>
    );
};

const MutationsState = () => {
    const pendingMutations = useMutationState({
        filters: {
            status: 'pending',
        },
    });

    return (
        <IsOffline>
            {pendingMutations.length > 0 ? (
                <p>You have pending mutations</p>
            ) : (
                <p>No pending mutations</p>
            )}
        </IsOffline>
    );
};

const Title = () => {
    const { defaultTitle } = useEditContext();
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
