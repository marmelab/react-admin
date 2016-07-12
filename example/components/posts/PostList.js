import React from 'react';
import Datagrid from '../../../src/list/data/Datagrid';
import TextField from '../../../src/field/TextField';

import { Link } from 'react-router'
const ActionField = ({ record }) => (
    <Link to={`/posts/${record.id}`}>View detail</Link>
)

const PostList = (props) => (
    <Datagrid title="All posts" { ...props }>
        <TextField label="id" source="id"/>
        <TextField label="title" source="title"/>
        <TextField label="published_at" source="published_at"/>
        <TextField label="average_note" source="average_note"/>
        <TextField label="views" source="views"/>
        <ActionField />
    </Datagrid>
);

export default PostList;
