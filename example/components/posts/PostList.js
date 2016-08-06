import React from 'react';
import { Datagrid, DateField, TextField, EditButton } from 'admin-on-rest/mui';

const PostList = (props) => (
    <Datagrid {...props}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <DateField label="published_at" source="published_at" />
        <TextField label="average_note" source="average_note" />
        <TextField label="views" source="views" />
        <EditButton />
    </Datagrid>
);

export default PostList;
