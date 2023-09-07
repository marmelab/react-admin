import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { I18nContextProvider, Resource, testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { Loading } from './Loading';

export default {
    title: 'ra-ui-materialui/layout/Loading',
};

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

export const Basic = () => <Loading />;

export const I18N = () => {
    return (
        <I18nContextProvider value={i18nProvider}>
            <Loading />
        </I18nContextProvider>
    );
};

export const InBox = () => (
    <div
        style={{
            position: 'absolute',
            top: 25,
            left: 40,
            height: 250,
            width: 400,
            border: '1px solid gray',
        }}
    >
        <Loading />
    </div>
);

export const FullApp = () => (
    <AdminContext dataProvider={testDataProvider()} i18nProvider={i18nProvider}>
        <AdminUI>
            {async () => {
                await new Promise(resolve => setTimeout(resolve, 5000));
                return (
                    <Resource
                        name="posts"
                        list={() => (
                            <div style={{ marginTop: 10 }}>Post list</div>
                        )}
                    />
                );
            }}
        </AdminUI>
    </AdminContext>
);

const LazyList = React.lazy(
    () =>
        new Promise(resolve =>
            setTimeout(
                () =>
                    resolve({
                        // @ts-ignore
                        default: () => (
                            <div style={{ marginTop: 10 }}>Post list</div>
                        ),
                    }),
                5000
            )
        )
);

export const LazyPage = () => (
    <AdminContext dataProvider={testDataProvider()} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource name="posts" list={LazyList} />
        </AdminUI>
    </AdminContext>
);
