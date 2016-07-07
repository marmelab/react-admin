import React from 'react';
import Resource from './Resource';
import Datagrid from './Datagrid';
import Column from './Column';

const PostList = () => (
    <Resource name="posts" path="http://localhost:3000/posts">
        <Datagrid title="All posts">
            <Column label="id" source="id"/>
            <Column label="title" source="title"/>
            <Column label="published_at" source="published_at"/>
            <Column label="average_note" source="average_note"/>
            <Column label="views" source="views"/>
        </Datagrid>
    </Resource>
);

export default PostList;
