import React, { Component } from 'react';
import { CREATE, LongTextInput, SimpleForm, TextInput } from 'react-admin'; // eslint-disable-line import/no-unresolved
import dataProvider from '../dataProvider';

export default class PostQuickCreate extends Component {
    handleSave = values => {
        dataProvider(CREATE, 'posts', { data: values })
            .then(({ data }) => {
                this.props.onSave(data);
            })
            .catch(error => {
                this.setState({ error });
            });
    };

    render() {
        return (
            <SimpleForm
                form="post-create"
                defaultValue={{ average_note: 0 }}
                save={this.handleSave}
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
        );
    }
}
