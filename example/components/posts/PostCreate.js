import React from 'react';
import Create from 'admin-on-rest/components/material-ui/detail/Create';
import { LongTextInput, TextInput } from 'admin-on-rest/components/material-ui/input';

const PostCreate = (props) => (
    <Create title="Create a Post" {...props}>
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <TextInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
    </Create>
);

export default PostCreate;
