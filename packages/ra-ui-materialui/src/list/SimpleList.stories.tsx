import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PreferencesEditorContextProvider } from 'ra-core';

import { SimpleList } from './SimpleList';
import { Inspector, InspectorButton } from '../configurable';

export default { title: 'ra-ui-materialui/list/SimpleList' };

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

export const Basic = () => (
    <MemoryRouter>
        <SimpleList
            data={data}
            primaryText={record => record.title}
            secondaryText={record => record.author}
            tertiaryText={record => record.year}
        />
    </MemoryRouter>
);

export const Configurable = () => (
    <PreferencesEditorContextProvider>
        <MemoryRouter>
            <Inspector />
            <InspectorButton />
            <SimpleList
                resource="books"
                data={data}
                primaryText={record => record.title}
                secondaryText={record => record.author}
                tertiaryText={record => record.year}
                sx={{ margin: 2 }}
            />
        </MemoryRouter>
    </PreferencesEditorContextProvider>
);
