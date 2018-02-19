import React from 'react';
import {
    AutocompleteInput,
    Create,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    LongTextInput,
    ReferenceField,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextField,
    TextInput,
    minLength,
    Show,
    SimpleShowLayout,
    required,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import ChatBubbleIcon from 'material-ui-icons/ChatBubble';
export const CommentIcon = ChatBubbleIcon;

export const CommentEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <DisabledInput source="id" />
            <ReferenceInput
                source="post_id"
                reference="posts"
                perPage={15}
                sort={{ field: 'title', order: 'ASC' }}
            >
                <AutocompleteInput optionText="title" />
            </ReferenceInput>
            <TextInput source="author.name" validate={minLength(10)} />
            <DateInput source="created_at" />
            <LongTextInput source="body" validate={minLength(10)} />
        </SimpleForm>
    </Edit>
);

export const CommentCreate = props => (
    <Create {...props}>
        <SimpleForm
            defaultValue={{
                created_at: new Date(),
                ...(props.location.state ? props.location.state.record : {}),
            }}
        >
            <ReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validate={required}
            >
                <SelectInput optionText="title" />
            </ReferenceInput>
            <DateInput source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export const CommentShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="author.name" />
            <DateField source="created_at" />
            <TextField source="body" />
        </SimpleShowLayout>
    </Show>
);
