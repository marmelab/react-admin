import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext } from 'ra-core';

import { ListGuesser } from './ListGuesser';
import { ThemeProvider } from '../layout';

describe('<ListGuesser />', () => {
    it('should log the guessed List view based on the fetched records', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const dataProvider = {
            getList: () =>
                Promise.resolve({
                    data: [
                        {
                            id: 123,
                            author: 'john doe',
                            post_id: 6,
                            score: 3,
                            body:
                                "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
                            created_at: new Date('2012-08-02'),
                        },
                    ],
                    total: 1,
                }),
        };
        render(
            <ThemeProvider theme={{}}>
                <CoreAdminContext dataProvider={dataProvider as any}>
                    <ListGuesser resource="comments" />
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() => {
            screen.getByText('john doe');
        });
        expect(logSpy).toHaveBeenCalledWith(`Guessed List:

import { Datagrid, DateField, List, NumberField, ReferenceField, TextField } from 'react-admin';

export const CommentList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="author" />
            <ReferenceField source="post_id" reference="posts" />
            <NumberField source="score" />
            <TextField source="body" />
            <DateField source="created_at" />
        </Datagrid>
    </List>
);`);
    });
});
