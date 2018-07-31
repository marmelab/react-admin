import React, { Component } from 'react';
import { connect } from 'react-redux';

import RichTextInput from 'ra-input-rich-text';
import {
    ArrayInput,
    BooleanInput,
    Create,
    crudCreate,
    DateInput,
    FormDataConsumer,
    LongTextInput,
    NumberInput,
    SaveButton,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
    Toolbar,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

const saveWithNote = (values, basePath, redirectTo) =>
    crudCreate('posts', { ...values, average_note: 10 }, basePath, redirectTo);

class SaveWithNoteButtonComponent extends Component {
    handleClick = () => {
        const { basePath, handleSubmit, redirect, saveWithNote } = this.props;

        return handleSubmit(values => {
            saveWithNote(values, basePath, redirect);
        });
    };

    render() {
        const { handleSubmitWithRedirect, saveWithNote, ...props } = this.props;

        return (
            <SaveButton
                handleSubmitWithRedirect={this.handleClick}
                {...props}
            />
        );
    }
}

const SaveWithNoteButton = connect(
    undefined,
    { saveWithNote }
)(SaveWithNoteButtonComponent);

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
        <SaveWithNoteButton
            label="post.action.save_with_average_note"
            redirect="show"
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
                        <NumberInput
                            source="average_note"
                            defaultValue={5}
                            {...rest}
                        />
                    )
                }
            </FormDataConsumer>
            <DateInput source="published_at" defaultValue={getDefaultDate} />
            <BooleanInput source="commentable" defaultValue />
            <ArrayInput
                source="backlinks"
                defaultValue={[
                    {
                        date: new Date().toISOString(),
                        url: 'http://google.com',
                    },
                ]}
            >
                <SimpleFormIterator>
                    <DateInput source="date" />
                    <TextInput source="url" />
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Create>
);

export default PostCreate;
