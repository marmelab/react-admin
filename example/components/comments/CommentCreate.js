import React from 'react';
import { Create, DateInput, LongTextInput, ReferenceInput } from 'admin-on-rest/mui';

const CommentCreate = (props) => (
    <Create title="Create a Comment" {...props}>
        <ReferenceInput label="Post" source="post_id" reference="posts" referenceSource="title" allowEmpty />
        <DateInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Create>
);

export default CommentCreate;
