import React from 'react';
import Edit from '../../../src/components/material-ui/detail/Edit';
import DisabledInput from '../../../src/components/material-ui/input/DisabledInput';
import TextInput from '../../../src/components/material-ui/input/TextInput';
import LongTextInput from '../../../src/components/material-ui/input/LongTextInput';

const PostEdit = (props) => (
    <Edit title="Post detail" {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <TextInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
        <DisabledInput label="Nb views" source="views" />
    </Edit>
);

export default PostEdit;
