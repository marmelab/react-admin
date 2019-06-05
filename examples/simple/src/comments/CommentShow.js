import React from 'react';
import { DateField, ReferenceField, Show, SimpleShowLayout, TextField } from 'react-admin'; // eslint-disable-line import/no-unresolved

const CommentShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="author.name" />
            <DateField source="created_at" />
            <TextField source="body" />
        </SimpleShowLayout>
    </Show>
);

export default CommentShow;
