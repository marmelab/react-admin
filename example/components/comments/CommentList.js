import React from 'react';
import { Datagrid, ReferenceField, TextField, EditButton } from 'admin-on-rest/mui';

const CommentList = (props) => (
    <Datagrid title="All comments" {...props} >
        <TextField label="id" source="id" />
        <ReferenceField label="Post" source="post_id" reference="posts" referenceSource="title" />
        <TextField label="date" source="created_at" />
        <EditButton basePath="/comments" />
    </Datagrid>
);

export default CommentList;
