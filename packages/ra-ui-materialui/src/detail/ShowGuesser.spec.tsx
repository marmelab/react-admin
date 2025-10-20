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

import { ArrayField, BooleanField, DataTable, DateField, EmailField, NumberField, ReferenceArrayField, ReferenceField, RichTextField, Show, SimpleShowLayout, TextArrayField, TextField, UrlField } from 'react-admin';

export const BookShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <ArrayField source="authors">
                <DataTable>
                    <DataTable.Col source="id">
                        <TextField source="id" />
                    </DataTable.Col>
                    <DataTable.Col source="name">
                        <TextField source="name" />
                    </DataTable.Col>
                    <DataTable.Col source="dob">
                        <DateField source="dob" />
                    </DataTable.Col>
                </DataTable>
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
            <TextArrayField source="genres" />
        </SimpleShowLayout>
    </Show>
);`);
    });
});
