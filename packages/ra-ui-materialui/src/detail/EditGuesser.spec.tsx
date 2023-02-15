import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import { CoreAdminContext } from 'ra-core';

import { EditGuesser } from './EditGuesser';
import { ThemeProvider } from '../layout';

describe('<EditGuesser />', () => {
    it('should log the guessed Edit view based on the fetched record', async () => {
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
            getMany: () => Promise.resolve({ data: [] }),
        };
        render(
            <ThemeProvider theme={{}}>
                <CoreAdminContext dataProvider={dataProvider as any}>
                    <EditGuesser resource="comments" id={123} />
                </CoreAdminContext>
            </ThemeProvider>
        );
        await waitFor(() => {
            screen.getByDisplayValue('john doe');
        });
        expect(logSpy).toHaveBeenCalledWith(`Guessed Edit:

import { DateInput, Edit, NumberInput, ReferenceInput, SimpleForm, TextInput } from 'react-admin';

export const CommentEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <TextInput source="author" />
            <ReferenceInput source="post_id" reference="posts" />
            <NumberInput source="score" />
            <TextInput source="body" />
            <DateInput source="created_at" />
        </SimpleForm>
    </Edit>
);`);
    });
});
