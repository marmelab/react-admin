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

const now = new Date();
const defaultSort = { field: 'title', order: 'ASC' };

const handleSubmit = (values, redirect) => {
    console.log('handleSubmit');
    console.log(values);
    console.log(redirect);
    return true;
};

const CommentCreate = props => (
    <Create {...props}>
        <SimpleForm redirect={false} onSubmit={handleSubmit}>
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
            <DateInput source="created_at" defaultValue={now} />
            <TextInput source="body" fullWidth={true} multiline={true} />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
