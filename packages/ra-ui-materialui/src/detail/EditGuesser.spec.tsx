import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { EditGuesser } from './EditGuesser.stories';

describe('<EditGuesser />', () => {
    it('should log the guessed Edit view based on the fetched record', async () => {
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        render(<EditGuesser />);
        await screen.findByDisplayValue('john doe');
        expect(logSpy).toHaveBeenCalledWith(`Guessed Edit:

import { ArrayInput, BooleanInput, DateInput, Edit, NumberInput, ReferenceArrayInput, ReferenceInput, SimpleForm, SimpleFormIterator, TextArrayInput, TextInput } from 'react-admin';

export const BookEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" />
            <ArrayInput source="authors"><SimpleFormIterator><TextInput source="id" />
<TextInput source="name" />
<DateInput source="dob" /></SimpleFormIterator></ArrayInput>
            <ReferenceInput source="post_id" reference="posts" />
            <NumberInput source="score" />
            <TextInput source="body" />
            <TextInput source="description" />
            <DateInput source="created_at" />
            <ReferenceArrayInput source="tags_ids" reference="tags" />
            <TextInput source="url" />
            <TextInput source="email" />
            <BooleanInput source="isAlreadyPublished" />
            <TextArrayInput source="genres" />
        </SimpleForm>
    </Edit>
);`);
    });
});
