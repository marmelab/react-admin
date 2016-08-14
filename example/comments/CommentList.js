import React from 'react';
import { List, ReferenceField, TextField, EditButton } from 'admin-on-rest/mui';
import CommentFilter from './CommentFilter';

const CommentList = (props) => (
    <List title="All comments" {...props} filter={CommentFilter}>
        <TextField label="id" source="id" />
        <ReferenceField label="Post" source="post_id" reference="posts" referenceSource="title" />
        <TextField label="date" source="created_at" />
        <EditButton />
    </List>
);

export default CommentList;
