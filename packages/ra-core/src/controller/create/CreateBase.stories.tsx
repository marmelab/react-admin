import * as React from 'react';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
    AuthProvider,
    CoreAdminContext,
    CreateBase,
    CreateBaseProps,
    DataProvider,
    I18nProvider,
    mergeTranslations,
    SaveHandlerCallbacks,
    testDataProvider,
    useCreateContext,
    useLocaleState,
    useSaveContext,
} from '../..';

export default {
    title: 'ra-core/controller/CreateBase',
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
                              create: 'Créer un article',
                          },
                      },
                  },
              })
            : mergeTranslations(englishMessages, {
                  resources: {
                      posts: {
                          page: {
                              create: 'Create an article',
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
        <CreateBase {...defaultProps}>
            <Title />
        </CreateBase>
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
} & Partial<CreateBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <CreateBase {...defaultProps} {...props}>
            <Child callTimeOptions={callTimeOptions} />
        </CreateBase>
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
        <CreateBase
            {...defaultProps}
            authLoading={<div>Authentication loading...</div>}
        >
            <Child />
        </CreateBase>
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
        <CreateBase
            {...defaultProps}
            authLoading={<div>Authentication loading...</div>}
        >
            <Child />
        </CreateBase>
    </CoreAdminContext>
);

export const WithRenderProp = ({
    dataProvider = defaultDataProvider,
    callTimeOptions,
}: {
    dataProvider?: DataProvider;
    callTimeOptions?: SaveHandlerCallbacks;
} & Partial<CreateBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <CreateBase
            {...defaultProps}
            render={({ save }) => {
                const handleClick = () => {
                    if (!save) return;
                    save({ test: 'test' }, callTimeOptions);
                };

                return <button onClick={handleClick}>save</button>;
            }}
        />
    </CoreAdminContext>
);

const defaultDataProvider = testDataProvider({
    // @ts-ignore
    create: (_, { data }) => Promise.resolve({ data: { id: 1, ...data } }),
});

const defaultProps = {
    hasCreate: true,
    hasEdit: true,
    hasList: true,
    hasShow: true,
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

    return <button onClick={handleClick}>save</button>;
};

const Title = () => {
    const { defaultTitle } = useCreateContext();
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
