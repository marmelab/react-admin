import React from 'react';
import { Create, DateInput, LongTextInput, TextInput } from 'admin-on-rest/mui';

const PostCreate = (props) => (
    <Create {...props}>
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
    </Create>
);

export default PostCreate;
