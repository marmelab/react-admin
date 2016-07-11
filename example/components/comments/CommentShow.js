import React from 'react';
import Show from '../../../src/detail/Show';
import Column from '../../../src/list/column/Column';

const CommentShow = (props) => (
    <Show title="Comment detail" {...props}>
    <Column label="id" source="id"/>
    <Column label="post_id" source="post_id"/>
    <Column label="date" source="created_at"/>
    <Column label="body" source="body"/>
    </Show>
);

export default CommentShow;
