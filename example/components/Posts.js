import React from 'react';
import Resource from '../../src/crud/Resource';
import Column from '../../src/list/column/Column';
import Datagrid from '../../src/list/data/Datagrid';
import Show from '../../src/detail/Show';

import { Link } from 'react-router'
const ActionColumn = ({record}) => (
    <Link to={`/posts/${record.id}`}>{record.id}</Link>
)

const Posts = () => (
    <Resource name="posts" endpoint="http://localhost:3000/posts">
        <Datagrid title="All posts" view="list">
            <Column label="id" source="id"/>
            <Column label="title" source="title"/>
            <Column label="published_at" source="published_at"/>
            <Column label="average_note" source="average_note"/>
            <Column label="views" source="views"/>
            <ActionColumn />
        </Datagrid>
        <Show title="Post detail" view="show">
            <Column label="id" source="id"/>
            <Column label="title" source="title"/>
            <Column label="published_at" source="published_at"/>
            <Column label="average_note" source="average_note"/>
            <Column label="views" source="views"/>
        </Show>
    </Resource>
);


export default Posts;
