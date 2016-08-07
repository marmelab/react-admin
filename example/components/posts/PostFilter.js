import React from 'react';
import { Filter, TextInput } from 'admin-on-rest/mui';

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
    </Filter>
);

export default PostFilter;
