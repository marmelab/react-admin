import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext } from 'ra-core';

import { ShowGuesser } from './ShowGuesser';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('<ShowGuesser />', () => {
    it('should log the guessed Show view based on the fetched record', async () => {
        const logSpy = jest
            .spyOn(console, 'log')
            .mockImplementation(console.warn);
        const dataProvider = {
            getOne: () =>
                Promise.resolve({
                    data: {
                        id: 123,
                        authors: [
                            { id: 1, name: 'john doe', dob: '1990-01-01' },
                            { id: 2, name: 'jane doe', dob: '1992-01-01' },
                        ],
                        post_id: 6,
                        score: 3,
                        body: "Queen, tossing her head through the wood. 'If it had lost something; and she felt sure it.",
                        created_at: new Date('2012-08-02'),
                        tags_ids: [1, 2],
                    },
                }),
            getMany: () => Promise.resolve({ data: [] }),
        };
        render(
            <ThemeProvider>
                <CoreAdminContext dataProvider={dataProvider as any}>
                    <ShowGuesser resource="comments" id={123} enableLog />
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() => {
            screen.getByText('john doe');
        });
        expect(logSpy).toHaveBeenCalledWith(`Guessed Show:

import { ArrayField, Datagrid, DateField, NumberField, ReferenceArrayField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin';

export const CommentShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ArrayField source="authors"><Datagrid><TextField source="id" />
<TextField source="name" />
<DateField source="dob" /></Datagrid></ArrayField>
            <ReferenceField source="post_id" reference="posts" />
            <NumberField source="score" />
            <TextField source="body" />
            <DateField source="created_at" />
            <ReferenceArrayField source="tags_ids" reference="tags" />
        </SimpleShowLayout>
    </Show>
);`);
    });
});
