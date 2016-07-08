import React from 'react';
import Column from '../../../src/list/column/Column';
import Datagrid from '../../../src/list/data/Datagrid';

import { Link } from 'react-router'
const ActionColumn = ({ record }) => (
    <Link to={`/posts/${record.id}`}>{record.id}</Link>
)

const PostList = () => (
    <Datagrid title="All posts" view="list" resource="posts" path="http://localhost:3000/posts">
        <Column label="id" source="id"/>
        <Column label="title" source="title"/>
        <Column label="published_at" source="published_at"/>
        <Column label="average_note" source="average_note"/>
        <Column label="views" source="views"/>
        <ActionColumn />
    </Datagrid>
);


export default PostList;
