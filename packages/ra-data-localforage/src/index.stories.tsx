import React from 'react';
import { Admin, EditGuesser, ListGuesser, Resource } from 'react-admin';
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
        <Admin dataProvider={dataProvider}>
            <Resource name="posts" list={ListGuesser} edit={EditGuesser} />
        </Admin>
    );
};
