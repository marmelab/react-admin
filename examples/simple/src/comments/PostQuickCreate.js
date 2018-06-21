import React from 'react';
import { Create, LongTextInput, SimpleForm, TextInput } from 'react-admin'; // eslint-disable-line import/no-unresolved

const PostQuickCreate = props => (
    <Create {...props}>
        <SimpleForm
            defaultValue={{ average_note: 0 }}
            validate={values => {
                const errors = {};
                ['title', 'teaser'].forEach(field => {
                    if (!values[field]) {
                        errors[field] = ['Required field'];
                    }
                });

                if (values.average_note < 0 || values.average_note > 5) {
                    errors.average_note = ['Should be between 0 and 5'];
                }

                return errors;
            }}
            redirect={false}
        >
            <TextInput source="title" />
            <LongTextInput source="teaser" />
        </SimpleForm>
    </Create>
);

export default PostQuickCreate;
