import * as React from 'react';
import { Resource } from 'ra-core';
import fakerestDataProvider from 'ra-data-fakerest';
import englishTranslations from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { ListGuesser } from '../list';
import { EditGuesser } from '../detail';
import { radiantLightTheme, radiantDarkTheme } from './radiantTheme';
import { testData } from './testData';

export default {
    title: 'ra-ui-materialui/theme/Radiant',
};

export const Radiant = () => (
    <AdminContext
        dataProvider={fakerestDataProvider(testData)}
        lightTheme={radiantLightTheme}
        darkTheme={radiantDarkTheme}
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
