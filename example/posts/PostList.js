import React from 'react';
import { List, DateField, TextField, EditButton } from 'admin-on-rest/mui';
import PostFilter from './PostFilter';

const PostList = (props) => (
    <List {...props} filter={PostFilter}>
        <TextField label="id" source="id" />
        <TextField label="title" source="title" />
        <DateField label="published_at" source="published_at" />
        <TextField label="average_note" source="average_note" />
        <TextField label="views" source="views" />
        <EditButton />
    </List>
);

export default PostList;
