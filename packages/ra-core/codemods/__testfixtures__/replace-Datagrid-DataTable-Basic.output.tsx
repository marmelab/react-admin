/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { List, DataTable } from 'react-admin';

const PostList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="id" label="Post number" />
            <DataTable.Col source="title" />
            <DataTable.Col source="body" />
        </DataTable>
    </List>
);

export default PostList;
