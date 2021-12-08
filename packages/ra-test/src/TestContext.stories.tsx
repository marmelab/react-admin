import * as React from 'react';
import { useGetOne, DataProviderContext } from 'ra-core';
import { QueryClientProvider, QueryClient } from 'react-query';

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
    const { data, isLoading } = useGetOne('books', { id });
    return isLoading ? <span>loading</span> : <span>{data.title}</span>;
};

export const WithDataProvider = () => (
    <TestContext enableReducers={true}>
        <QueryClientProvider client={new QueryClient()}>
            <DataProviderContext.Provider value={dataProvider}>
                <Book id={1} />
            </DataProviderContext.Provider>
        </QueryClientProvider>
    </TestContext>
);
