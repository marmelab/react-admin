import * as React from 'react';

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

const CommentCreate = () => (
    <Create redirect={false}>
        <SimpleForm>
            <PostReferenceInput
                source="post_id"
                reference="posts"
                validate={required()}
                perPage={10000}
                sort={defaultSort}
            />
            <TextInput source="author.name" validate={minLength(10)} />
            <DateInput source="created_at" defaultValue={now} />
            <TextInput fullWidth source="body" multiline />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
