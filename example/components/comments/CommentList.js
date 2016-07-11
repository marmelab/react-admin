import React from 'react';
import Datagrid from '../../../src/list/data/Datagrid';
import Column from '../../../src/list/column/Column';

import { Link } from 'react-router'
const ActionColumn = ({ record }) => (
    <Link to={`/comments/${record.id}`}>View detail</Link>
)

const CommentList = (props) => (
    <Datagrid title="All comments" { ...props }>
        <Column label="id" source="id"/>
        <Column label="post_id" source="post_id"/>
        <Column label="date" source="created_at"/>
        <ActionColumn />
    </Datagrid>
);

export default CommentList;
