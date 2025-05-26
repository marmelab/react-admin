import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { ShowGuesser } from './ShowGuesser.stories';

describe('<ShowGuesser />', () => {
    it('should log the guessed Show view based on the fetched record', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        render(<ShowGuesser />);
        await screen.findByText('john doe');
        expect(logSpy).toHaveBeenCalledWith(`Guessed Show:

import { ArrayField, BooleanField, Datagrid, DateField, EmailField, NumberField, ReferenceArrayField, ReferenceField, RichTextField, Show, SimpleShowLayout, TextField, UrlField } from 'react-admin';

export const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ArrayField source="authors">
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    <DateField source="dob" />
                </Datagrid>
            </ArrayField>
            <ReferenceField source="post_id" reference="posts" />
            <NumberField source="score" />
            <TextField source="body" />
            <RichTextField source="description" />
            <DateField source="created_at" />
            <ReferenceArrayField source="tags_ids" reference="tags" />
            <UrlField source="url" />
            <EmailField source="email" />
            <BooleanField source="isAlreadyPublished" />
        </SimpleShowLayout>
    </Show>
);`);
    });
});
