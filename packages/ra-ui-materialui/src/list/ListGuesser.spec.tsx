import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext, testDataProvider } from 'ra-core';

import { ListGuesser } from './ListGuesser';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('<ListGuesser />', () => {
    it('should log the guessed List view based on the fetched records', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const dataProvider = testDataProvider({
            getList: () =>
                Promise.resolve({
                    data: [
                        {
                            id: 123,
                            author: 'john doe',
                            post_id: 6,
                            score: 3,
                            body: "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
                            created_at: new Date('2012-08-02'),
                            tags_ids: [1, 2],
                        },
                    ],
                    total: 1,
                }),
            getMany: () => Promise.resolve({ data: [], total: 0 }),
        });
        render(
            <ThemeProvider>
                <CoreAdminContext dataProvider={dataProvider as any}>
                    <ListGuesser resource="comments" enableLog />
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() => {
            screen.getByText('john doe');
        });
        expect(logSpy).toHaveBeenCalledWith(`Guessed List:

import { Datagrid, DateField, List, NumberField, ReferenceArrayField, ReferenceField, TextField } from 'react-admin';

export const CommentList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="author" />
            <ReferenceField source="post_id" reference="posts" />
            <NumberField source="score" />
            <TextField source="body" />
            <DateField source="created_at" />
            <ReferenceArrayField source="tags_ids" reference="tags" />
        </Datagrid>
    </List>
);`);
    });
});
