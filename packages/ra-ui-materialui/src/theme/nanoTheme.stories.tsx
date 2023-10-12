import * as React from 'react';
import { Resource } from 'ra-core';
import fakerestDataProvider from 'ra-data-fakerest';
import englishTranslations from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { ListGuesser } from '../list';
import { EditGuesser } from '../detail';
import { nanoLightTheme, nanoDarkTheme } from './nanoTheme';
import { testData } from './testData';

export default {
    title: 'ra-ui-materialui/theme/Nano',
};

export const Nano = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        lightTheme={nanoLightTheme}
        darkTheme={nanoDarkTheme}
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
