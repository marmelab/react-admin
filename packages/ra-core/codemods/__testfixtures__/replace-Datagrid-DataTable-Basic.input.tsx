/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { List, Datagrid, TextField } from 'react-admin';

const PostList = () => (
    <List>
        <Datagrid>
            <TextField source="id" label="Post number" />
            <TextField source="title" />
            <TextField source="body" />
        </Datagrid>
    </List>
);

export default PostList;
