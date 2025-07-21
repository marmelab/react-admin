import * as React from 'react';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import {
    AuthProvider,
    CoreAdminContext,
    ShowBase,
    ShowBaseProps,
    DataProvider,
    testDataProvider,
    useRecordContext,
    mergeTranslations,
    I18nProvider,
    useShowContext,
    useLocaleState,
} from '../..';

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
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <ShowBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
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
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

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

const defaultDataProvider = testDataProvider({
    getOne: () =>
        // @ts-ignore
        Promise.resolve({ data: { id: 12, test: 'Hello', title: 'Hello' } }),
});

const defaultProps = {
    id: 12,
    resource: 'posts',
};

const Child = () => {
    const record = useRecordContext();

    return <p>{record?.test}</p>;
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
