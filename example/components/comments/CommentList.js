import React from 'react';
import Datagrid from '../../../src/components/material-ui/list/Datagrid';
import { ReferenceField, TextField } from '../../../src/components/material-ui/field';
import { EditButton } from '../../../src/components/material-ui/button';

const CommentList = (props) => (
    <Datagrid title="All comments" {...props} >
        <TextField label="id" source="id" />
        <ReferenceField label="Post" source="post_id" reference="posts" referenceSource="title" />
        <TextField label="date" source="created_at" />
        <EditButton basePath="/comments" />
    </Datagrid>
);

export default CommentList;
