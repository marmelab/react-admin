import React from 'react';
import { Filter, TextInput } from 'admin-on-rest/mui';

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="Title" source="title" />
    </Filter>
);

export default PostFilter;
