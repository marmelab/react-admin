import React from 'react';
import Show from '../../../src/detail/Show';
import DisabledInput from '../../../src/input/DisabledInput';
import TextInput from '../../../src/input/TextInput';
import LongTextInput from '../../../src/input/LongTextInput';

const PostShow = (props) => (
    <Show title="Post detail" {...props}>
        <DisabledInput label="Id" source="id"/>
        <TextInput label="Title" source="title"/>
        <TextInput label="Teaser" source="teaser" options={{multiLine: true}}/>
        <LongTextInput label="Body" source="body"/>
        <TextInput label="Publication date" source="published_at"/>
        <TextInput label="Average note" source="average_note"/>
        <DisabledInput label="Nb views" source="views"/>
    </Show>
);

export default PostShow;
