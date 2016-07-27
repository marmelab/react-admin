import React from 'react';
import { Edit, DisabledInput, LongTextInput, TextInput } from 'admin-on-rest/mui';

const CommentEdit = (props) => (
    <Edit title="Comment detail" {...props}>
        <DisabledInput label="id" source="id" />
        <TextInput label="post_id" source="post_id" />
        <TextInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Edit>
);

export default CommentEdit;
