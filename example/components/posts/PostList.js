import React from 'react';
import Datagrid from '../../../src/components/material-ui/list/Datagrid';
import { DateField, TextField } from '../../../src/components/material-ui/field';
import { EditButton } from '../../../src/components/material-ui/button';

const PostList = (props) => (
    <Datagrid title="All posts" {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <DateField label="published_at" source="published_at" />
        <TextField label="average_note" source="average_note" />
        <TextField label="views" source="views" />
        <EditButton basePath="/posts" />
    </Datagrid>
);

export default PostList;
