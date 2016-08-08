import React from 'react';
import { Datagrid, ReferenceField, TextField, EditButton } from 'admin-on-rest/mui';
import CommentFilter from './CommentFilter';

const CommentList = (props) => (
    <Datagrid title="All comments" {...props} filter={CommentFilter}>
        <TextField label="id" source="id" />
        <ReferenceField label="Post" source="post_id" reference="posts" referenceSource="title" />
        <TextField label="date" source="created_at" />
        <EditButton />
    </Datagrid>
);

export default CommentList;
