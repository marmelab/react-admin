import React from 'react';
import Create from '../../../src/components/material-ui/detail/Create';
import { LongTextInput, TextInput } from '../../../src/components/material-ui/input';

const CommentCreate = (props) => (
    <Create title="Create a Comment" {...props}>
        <TextInput label="post_id" source="post_id" />
        <TextInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Create>
);

export default CommentCreate;
