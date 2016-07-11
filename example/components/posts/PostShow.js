import React from 'react';
import Show from '../../../src/detail/Show';
import Column from '../../../src/list/column/Column';

const PostShow = (props) => (
    <Show title="Post detail" {...props}>
        <Column label="id" source="id"/>
        <Column label="title" source="title"/>
        <Column label="published_at" source="published_at"/>
        <Column label="average_note" source="average_note"/>
        <Column label="views" source="views"/>
    </Show>
);

export default PostShow;
