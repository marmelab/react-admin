import React, { Component } from 'react';
import { connect } from 'react-redux';

import RichTextInput from 'ra-input-rich-text';
import {
    ArrayInput,
    AutocompleteInput,
    BooleanInput,
    Create,
    DateInput,
    FormDataConsumer,
    LongTextInput,
    NumberInput,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    crudCreate,
    required,
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
            label="post.action.save_and_edit"
            redirect="edit"
            submitOnEnter={true}
        />
        <SaveButton
            label="post.action.save_and_show"
            redirect="show"
            submitOnEnter={false}
            variant="flat"
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

const PostCreate = ({ permissions, ...props }) => (
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
            <TextInput autoFocus source="title" />
            <LongTextInput source="teaser" />
            <RichTextInput source="body" validate={[required()]} />
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
            {permissions === 'admin' && (
                <ArrayInput source="authors">
                    <SimpleFormIterator>
                        <ReferenceInput
                            label="User"
                            source="user_id"
                            reference="users"
                        >
                            <AutocompleteInput />
                        </ReferenceInput>
                        <FormDataConsumer>
                            {({
                                formData,
                                scopedFormData,
                                getSource,
                                ...rest
                            }) =>
                                scopedFormData.user_id ? (
                                    <SelectInput
                                        label="Role"
                                        source={getSource('role')}
                                        choices={[
                                            {
                                                id: 'headwriter',
                                                name: 'Head Writer',
                                            },
                                            {
                                                id: 'proofreader',
                                                name: 'Proof reader',
                                            },
                                            {
                                                id: 'cowriter',
                                                name: 'Co-Writer',
                                            },
                                        ]}
                                        {...rest}
                                    />
                                ) : null
                            }
                        </FormDataConsumer>
                    </SimpleFormIterator>
                </ArrayInput>
            )}
        </SimpleForm>
    </Create>
);

export default PostCreate;
