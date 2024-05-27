import * as React from 'react';

import {
    Create,
    DateInput,
    TextInput,
    SimpleFormConfigurable,
    minLength,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import PostReferenceInput from './PostReferenceInput';

const now = new Date();

const CommentCreate = () => (
    <Create redirect={false}>
        <SimpleFormConfigurable sx={{ maxWidth: { md: 'auto', lg: '30em' } }}>
            <PostReferenceInput />
            <TextInput source="author.name" validate={minLength(10)} />
            <DateInput source="created_at" defaultValue={now} />
            <TextInput source="body" multiline />
        </SimpleFormConfigurable>
    </Create>
);

export default CommentCreate;
