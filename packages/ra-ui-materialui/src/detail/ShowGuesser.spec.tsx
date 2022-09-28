import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext } from 'ra-core';

import { ShowGuesser } from './ShowGuesser';
import { ThemeProvider } from '../layout';

describe('<ShowGuesser />', () => {
    it('should log the guessed Show view based on the fetched record', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        const dataProvider = {
            getOne: () =>
                Promise.resolve({
                    data: {
                        id: 123,
                        author: 'john doe',
                        post_id: 6,
                        score: 3,
                        body:
                            "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
                        created_at: new Date('2012-08-02'),
                    },
                }),
        };
        render(
            <ThemeProvider theme={{}}>
                <CoreAdminContext dataProvider={dataProvider as any}>
                    <ShowGuesser resource="comments" id={123} />
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() => {
            screen.getByText('john doe');
        });
        expect(logSpy).toHaveBeenCalledWith(`Guessed Show:

import { DateField, NumberField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const CommentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="author" />
            <ReferenceField source="post_id" reference="posts" />
            <NumberField source="score" />
            <TextField source="body" />
            <DateField source="created_at" />
        </SimpleShowLayout>
    </Show>
);`);
    });
});
