import React from 'react';
import Edit from '../../../src/detail/Edit';
import DisabledInput from '../../../src/input/DisabledInput';
import TextInput from '../../../src/input/TextInput';
import LongTextInput from '../../../src/input/LongTextInput';

const CommentEdit = (props) => (
    <Edit title="Comment detail" {...props}>
        <DisabledInput label="id" source="id" />
        <TextInput label="post_id" source="post_id" />
        <TextInput label="date" source="created_at" />
        <LongTextInput label="body" source="body" />
    </Edit>
);

export default CommentEdit;
