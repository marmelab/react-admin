import React from 'react';
import { Edit, DateInput, DisabledInput, LongTextInput, TextInput } from 'admin-on-rest/mui';

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

const PostEdit = (props) => (
    <Edit title={PostTitle} {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
        <DisabledInput label="Nb views" source="views" />
    </Edit>
);

export default PostEdit;
