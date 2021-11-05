import * as React from 'react';
import { useGetOne, DataProviderContext } from 'ra-core';

import TestContext from './TestContext';

export default { title: 'ra-test/TestContext' };

const dataProvider = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'foo',
            },
        }),
} as any;

const Book = ({ id }) => {
    const { data, loaded } = useGetOne('books', id);
    return loaded ? <span>{data.title}</span> : <span>loading</span>;
};

export const WithDataProvider = () => (
    <TestContext
        enableReducers={true}
        // FIXME: Resources must be initialized to allow dataProvider hooks to work
        initialState={{ admin: { resources: { books: { data: {} } } } }}
    >
        <DataProviderContext.Provider value={dataProvider}>
            <Book id={1} />
        </DataProviderContext.Provider>
    </TestContext>
);
