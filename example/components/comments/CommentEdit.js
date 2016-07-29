import React from 'react';
import { Edit, DateInput, DisabledInput, LongTextInput, ReferenceInput } from 'admin-on-rest/mui';

const CommentEdit = (props) => (
    <Edit title="Comment detail" {...props}>
        <DisabledInput label="id" source="id" />
        <ReferenceInput label="Post" source="post_id" reference="posts" referenceSource="title" />
        <DateInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Edit>
);

export default CommentEdit;
