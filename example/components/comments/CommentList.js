import React from 'react';
import Datagrid from '../../../src/list/Datagrid';
import TextField from '../../../src/field/TextField';
import EditButton from '../../../src/button/EditButton';

const CommentList = (props) => (
    <Datagrid title="All comments" {...props} >
        <TextField label="id" source="id" />
        <TextField label="post_id" source="post_id" />
        <TextField label="date" source="created_at" />
        <EditButton basePath="/comments" />
    </Datagrid>
);

export default CommentList;
