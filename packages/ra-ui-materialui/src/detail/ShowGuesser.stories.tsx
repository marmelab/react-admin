import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, TestMemoryRouter } from 'ra-core';
import fakeRestProvider from 'ra-data-fakerest';

import { ShowGuesser as RAShowGuesser } from './ShowGuesser';

export default { title: 'ra-ui-materialui/detail/ShowGuesser' };

const data = {
    books: [
        {
            id: 123,
            authors: [
                { id: 1, name: 'john doe', dob: '1990-01-01' },
                { id: 2, name: 'jane doe', dob: '1992-01-01' },
            ],
            post_id: 6,
            score: 3,
            body: "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
            description: `<p><strong>War and Peace</strong> is a novel by the Russian author <a href="https://en.wikipedia.org/wiki/Leo_Tolstoy">Leo Tolstoy</a>,
published serially, then in its entirety in 1869.</p>
<p>It is regarded as one of Tolstoy's finest literary achievements and remains a classic of world literature.</p>`,
            created_at: new Date('2012-08-02'),
            tags_ids: [1, 2],
            url: 'https://www.myshop.com/tags/top-seller',
            email: 'doe@production.com',
            isAlreadyPublished: true,
            genres: [
                'Fiction',
                'Historical Fiction',
                'Classic Literature',
                'Russian Literature',
            ],
        },
    ],
    tags: [
        { id: 1, name: 'top seller' },
        { id: 2, name: 'new' },
    ],
    posts: [
        { id: 6, title: 'War and Peace', body: 'A great novel by Leo Tolstoy' },
    ],
};

const ShowGuesserWithProdLogs = () => <RAShowGuesser enableLog />;

export const ShowGuesser = () => (
    <TestMemoryRouter initialEntries={['/books/123/show']}>
        <Admin dataProvider={fakeRestProvider(data)}>
            <Resource name="books" show={ShowGuesserWithProdLogs} />
        </Admin>
    </TestMemoryRouter>
);
