import * as React from 'react';

import {
    Create,
    DateInput,
    TextInput,
    SimpleForm,
    ReferenceInput,
    AutocompleteInput,
    minLength,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const now = new Date();
const defaultSort = { field: 'title', order: 'ASC' };
const CommentCreate = () => (
    <Create redirect={false}>
        <SimpleForm>
            <ReferenceInput
                source="post_id"
                reference="posts"
                sort={defaultSort}
                perPage={5}
            >
                <AutocompleteInput optionText="title" optionValue="id" />
            </ReferenceInput>
            <TextInput source="author.name" validate={minLength(10)} />
            <DateInput source="created_at" defaultValue={now} />
            <TextInput fullWidth source="body" multiline />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
