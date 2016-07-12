import React from 'react';
import Show from '../../../src/detail/Show';
import DisabledInput from '../../../src/input/DisabledInput';
import TextInput from '../../../src/input/TextInput';
import LongTextInput from '../../../src/input/LongTextInput';

const CommentShow = (props) => (
    <Show title="Comment detail" {...props}>
        <DisabledInput label="id" source="id"/>
        <TextInput label="post_id" source="post_id"/>
        <TextInput label="date" source="created_at"/>
        <LongTextInput label="body" source="body"/>
    </Show>
);

export default CommentShow;
