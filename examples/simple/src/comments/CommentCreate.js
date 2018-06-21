import React from 'react';

import {
    Create,
    DateInput,
    LongTextInput,
    SimpleForm,
    required,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import PostReferenceInput from './PostReferenceInput';

const defaultValue = { created_at: new Date() };
const CommentCreate = props => (
    <Create {...props}>
        <SimpleForm defaultValue={defaultValue}>
            <PostReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validate={required()}
                perPage={10000}
            />
            <DateInput source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
