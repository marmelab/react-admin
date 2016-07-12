import React from 'react';
import Datagrid from '../../../src/list/data/Datagrid';
import TextField from '../../../src/field/TextField';

import { Link } from 'react-router';
const ActionField = ({ record }) => (
    <Link to={`/comments/${record.id}`}>View detail</Link>
);

const CommentList = (props) => (
    <Datagrid title="All comments" {...props} >
        <TextField label="id" source="id" />
        <TextField label="post_id" source="post_id" />
        <TextField label="date" source="created_at" />
        <ActionField />
    </Datagrid>
);

export default CommentList;
