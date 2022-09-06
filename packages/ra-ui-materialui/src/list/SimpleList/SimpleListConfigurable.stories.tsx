import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreferencesEditorContextProvider, I18nContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { SimpleListConfigurable } from './SimpleListConfigurable';
import { Inspector, InspectorButton } from '../../preferences';

export default { title: 'ra-ui-materialui/list/SimpleListConfigurable' };

const data = [
    {
        id: 1,
        title: 'War and Peace',
        author: 'Leo Tolstoy',
        year: 1869,
    },
    {
        id: 2,
        title: 'Pride and Predjudice',
        author: 'Jane Austen',
        year: 1813,
    },
    {
        id: 3,
        title: 'The Picture of Dorian Gray',
        author: 'Oscar Wilde',
        year: 1890,
    },
    {
        id: 4,
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        year: 1943,
    },
];

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

export const Basic = () => (
    <I18nContextProvider value={i18nProvider}>
        <PreferencesEditorContextProvider>
            <MemoryRouter>
                <Inspector />
                <InspectorButton />
                <SimpleListConfigurable
                    resource="books"
                    data={data}
                    primaryText={record => record.title}
                    secondaryText={record => record.author}
                    tertiaryText={record => record.year}
                    sx={{ margin: 2 }}
                />
            </MemoryRouter>
        </PreferencesEditorContextProvider>
    </I18nContextProvider>
);
