import React from 'react';
import { Edit, DisabledInput, LongTextInput, ReferenceInput, TextInput } from 'admin-on-rest/mui';

const CommentEdit = (props) => (
    <Edit title="Comment detail" {...props}>
        <DisabledInput label="id" source="id" />
        <ReferenceInput label="Post" source="post_id" reference="posts" referenceSource="title" />
        <TextInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Edit>
);

export default CommentEdit;
