import React from 'react';
import Show from '../../../src/detail/Show';
import TextField from '../../../src/field/TextField';

const PostShow = (props) => (
    <Show title="Post detail" {...props}>
        <TextField label="id" source="id"/>
        <TextField label="title" source="title"/>
        <TextField label="published_at" source="published_at"/>
        <TextField label="average_note" source="average_note"/>
        <TextField label="views" source="views"/>
    </Show>
);

export default PostShow;
