import React from 'react';
import { Resource } from 'ra-core';
import {
    AdminContext,
    AdminUI,
    EditGuesser,
    ListGuesser,
} from 'ra-ui-materialui';
import localforageDataProvider from './index';

export default {
    title: 'ra-data-local-forage',
};

export const Basic = () => {
    const dataProvider = localforageDataProvider({
        prefixLocalForageKey: 'story-app-',
        defaultData: {
            posts: [
                { id: 1, title: 'Hello, world!' },
                { id: 2, title: 'FooBar' },
            ],
        },
    });

    return (
        <AdminContext dataProvider={dataProvider}>
            <AdminUI>
                <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
            </AdminUI>
        </AdminContext>
    );
};
