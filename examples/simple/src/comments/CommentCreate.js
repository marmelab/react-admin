import React from 'react';
import {
    Create,
    DateInput,
    LongTextInput,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    required,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const defaultValue = { created_at: new Date() };
const CommentCreate = props => (
    <Create {...props}>
        <SimpleForm defaultValue={defaultValue}>
            <ReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validate={required()}
            >
                <SelectInput optionText="title" />
            </ReferenceInput>
            <DateInput source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export default CommentCreate;
