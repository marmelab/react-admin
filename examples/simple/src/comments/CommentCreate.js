import React from 'react';

import {
    Create,
    DateInput,
    TextInput,
    SimpleForm,
    required,
    minLength,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import PostReferenceInput from './PostReferenceInput';

const defaultValue = { created_at: new Date() };
const defaultSort = { field: 'title', order: 'ASC' };

const CommentCreate = props => (
    <Create {...props}>
        <SimpleForm redirect={false} defaultValue={defaultValue}>
            <PostReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validate={required()}
                perPage={10000}
                sort={defaultSort}
            />
            <TextInput
                source="author.name"
                validate={minLength(10)}
                fullWidth
            />
            <DateInput source="created_at" />
            <TextInput source="body" fullWidth={true} multiline={true} />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
