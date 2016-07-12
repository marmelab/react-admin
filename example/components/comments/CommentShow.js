import React from 'react';
import Show from '../../../src/detail/Show';
import TextField from '../../../src/field/TextField';

const CommentShow = (props) => (
    <Show title="Comment detail" {...props}>
        <TextField label="id" source="id"/>
        <TextField label="post_id" source="post_id"/>
        <TextField label="date" source="created_at"/>
        <TextField label="body" source="body"/>
    </Show>
);

export default CommentShow;
