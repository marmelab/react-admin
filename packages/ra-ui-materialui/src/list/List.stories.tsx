import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, useListContext } from 'ra-core';
import { createMemoryHistory } from 'history';
import { Stack, Card } from '@mui/material';

import { List } from './List';

export default { title: 'ra-ui-materialui/list/List' };

const dataProvider = {
    getList: (resource, params) =>
        Promise.resolve({
            data: [
                {
                    id: 1,
                    title: 'War and Peace',
                    author: 'Leo Tolstoy',
                    summary:
                        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                    year: 1869,
                },
                {
                    id: 2,
                    title: 'Pride and Predjudice',
                    author: 'Jane Austen',
                    summary:
                        'Pride and Prejudice is a romance novel considered one of the most important novels in English literature',
                    year: 1813,
                },
            ],
            total: 2,
        }),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books'] });

const BookList = () => {
    const { data, isLoading } = useListContext();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <Card sx={{ padding: 2, flex: 1 }}>
            <Stack spacing={2}>
                {data.map(book => (
                    <div key={book.id}>
                        "{book.title}" by {book.author} ({book.year})
                    </div>
                ))}
            </Stack>
        </Card>
    );
};

const BookListBasic = () => (
    <List>
        <BookList />
    </List>
);

export const Basic = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListBasic} />
    </Admin>
);

const BookListBasicWithCustomActions = () => (
    <List actions={<Card>Actions</Card>}>
        <BookList />
    </List>
);

export const Actions = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" list={BookListBasicWithCustomActions} />
    </Admin>
);
