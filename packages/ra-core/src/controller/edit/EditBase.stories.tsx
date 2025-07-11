import * as React from 'react';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
    AuthProvider,
    CoreAdminContext,
    EditBase,
    EditBaseProps,
    DataProvider,
    SaveHandlerCallbacks,
    testDataProvider,
    useSaveContext,
    useRecordContext,
    I18nProvider,
    mergeTranslations,
    useEditContext,
    useLocaleState,
    MutationMode,
} from '../..';

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
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <EditBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
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
            loading={<div>Authentication loading...</div>}
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

const defaultDataProvider = testDataProvider({
    getOne: () =>
        // @ts-ignore
        Promise.resolve({ data: { id: 12, test: 'Hello', title: 'Hello' } }),
});

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
    const record = useRecordContext();

    const handleClick = () => {
        if (!saveContext || !saveContext.save) return;
        saveContext.save({ test: 'test' }, callTimeOptions);
    };

    return (
        <>
            <p>{record?.test}</p>
            <button onClick={handleClick}>save</button>
        </>
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
