import * as React from 'react';
import { Resource } from 'ra-core';
import fakerestDataProvider from 'ra-data-fakerest';
import englishTranslations from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { ListGuesser } from '../list';
import { EditGuesser } from '../detail';
import { defaultLightTheme, defaultDarkTheme } from './defaultTheme';
import { testData } from './testData';

export default {
    title: 'ra-ui-materialui/theme/Default',
};

export const Default = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        lightTheme={defaultLightTheme}
        darkTheme={defaultDarkTheme}
        defaultTheme="light"
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
