import React from 'react';

import {
    Create,
    DateInput,
    TextInput,
    LongTextInput,
    SimpleForm,
    required,
    minLength,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import PostReferenceInput from './PostReferenceInput';

const defaultValue = { created_at: new Date() };
const CommentCreate = ({ location, ...props }) => (
    <Create record={location.state || defaultValue} {...props}>
        <SimpleForm redirect={false}>
            <PostReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validate={required()}
                perPage={10000}
            />
            <TextInput
                source="author.name"
                validate={minLength(10)}
                fullWidth
            />
            <DateInput source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
