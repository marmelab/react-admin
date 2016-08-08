import React from 'react';
import { Filter, ReferenceInput } from 'admin-on-rest/mui';

const CommentFilter = (props) => (
    <Filter {...props}>
        <ReferenceInput label="Post" source="post_id" reference="posts" referenceSource="title" allowEmpty />
    </Filter>
);

export default CommentFilter;
