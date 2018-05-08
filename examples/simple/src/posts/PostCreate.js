import RichTextInput from 'ra-input-rich-text';
import React from 'react';
import {
    BooleanInput,
    Create,
    DateInput,
    FormDataConsumer,
    LongTextInput,
    NumberInput,
    SaveButton,
    SimpleForm,
    TextInput,
    Toolbar,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const PostCreateToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="post.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        <SaveButton
            label="post.action.save_and_add"
            redirect={false}
            submitOnEnter={false}
            variant="flat"
        />
    </Toolbar>
);

const getDefaultDate = () => new Date();

const PostCreate = props => (
    <Create {...props}>
        <SimpleForm
            toolbar={<PostCreateToolbar />}
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
        >
            <TextInput source="title" />
            <LongTextInput source="teaser" />
            <RichTextInput source="body" />
            <FormDataConsumer>
                {({ formData, ...rest }) =>
                    formData.title && (
                        <NumberInput source="average_note" {...rest} />
                    )}
            </FormDataConsumer>
            <DateInput source="published_at" defaultValue={getDefaultDate} />
            <BooleanInput source="commentable" defaultValue />
        </SimpleForm>
    </Create>
);

export default PostCreate;
