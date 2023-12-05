import * as React from 'react';
import { Resource } from 'ra-core';
import fakerestDataProvider from 'ra-data-fakerest';
import englishTranslations from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { ListGuesser } from '../list';
import { EditGuesser } from '../detail';
import { testData } from './testData';
import { nanoDarkTheme, nanoLightTheme } from './nanoTheme';
import { radiantDarkTheme, radiantLightTheme } from './radiantTheme';

export default {
    title: 'ra-ui-materialui/theme/Priority',
};

export const DefaultLightAndDarkTheme = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        i18nProvider={polyglotI18nProvider(() => englishTranslations, 'en')}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);

export const DisableDarkTheme = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        i18nProvider={polyglotI18nProvider(() => englishTranslations, 'en')}
        darkTheme={null}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);

export const CustomMasterThemeAndNoDarkTheme = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        i18nProvider={polyglotI18nProvider(() => englishTranslations, 'en')}
        theme={nanoLightTheme}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);

export const CustomMasterThemeAndCustomDarkTheme = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        i18nProvider={polyglotI18nProvider(() => englishTranslations, 'en')}
        theme={nanoLightTheme}
        darkTheme={radiantDarkTheme}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);

export const DefaultLighThemeAndCustomDarkTheme = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        i18nProvider={polyglotI18nProvider(() => englishTranslations, 'en')}
        darkTheme={nanoDarkTheme}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);

export const CustomLighThemeAndCustomDarkTheme = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        i18nProvider={polyglotI18nProvider(() => englishTranslations, 'en')}
        lightTheme={radiantLightTheme}
        darkTheme={nanoDarkTheme}
    >
        <AdminUI>
            <Resource
                name="products"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="categories"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
            <Resource
                name="tags"
                list={ListGuesser}
                edit={EditGuesser}
                recordRepresentation="name"
            />
        </AdminUI>
    </AdminContext>
);
