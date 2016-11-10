import React from 'react';
import {
    Create,
    Datagrid,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    EditButton,
    Filter,
    List,
    LongTextInput,
    ReferenceManyField,
    Show,
    ShowButton,
    TextField,
    TextInput,
    RichTextField,
    RichTextInput,
} from 'admin-on-rest/mui';

export PostIcon from 'material-ui/svg-icons/action/book';

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="Title" source="title" />
    </Filter>
);

export const PostList = (props) => (
    <List {...props} filter={PostFilter}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" type="email" style={{ display: 'inline-block', maxWidth: '20em', overflow: 'hidden', textOverflow: 'ellipsis' }}/>
            <DateField source="published_at" style={{ fontStyle: 'italic' }} />
            <TextField source="views" />
            <EditButton />
            <ShowButton />
        </Datagrid>
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostCreate = (props) => (
    <Create
        {...props}
        validation={(values) => {
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
        <TextInput label="Password (if protected post)" source="password" type="password" />
        <TextInput source="teaser" options={{ multiLine: true }} />
        <RichTextInput source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput source="average_note" />
    </Create>
);

export const PostEdit = (props) => (
    <Edit title={PostTitle} {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput source="title" validation={{ required: true }} />
        <TextInput label="Password (if protected post)" source="password" type="password" />
        <LongTextInput source="teaser" validation={{ required: true }} />
        <RichTextInput source="body" validation={{ required: true }} />
        <DateInput label="Publication date" source="published_at" />
        <TextInput source="average_note" validation={{ min: 0 }} />
        <ReferenceManyField label="Comments" reference="comments" target="post_id">
            <Datagrid>
                <TextField source="body" />
                <DateField source="created_at" />
                <EditButton />
            </Datagrid>
        </ReferenceManyField>
        <DisabledInput label="Nb views" source="views" />
    </Edit>
);

export const PostShow = (props) => (
    <Show title={PostTitle} {...props}>
        <TextField source="id" />
        <TextField source="title" />
        <TextField source="teaser" />
        <RichTextField source="body" stripTags={false} />
        <DateField source="published_at" style={{ fontStyle: 'italic' }} />
        <TextField source="average_note" />
        <ReferenceManyField label="Comments" reference="comments" target="post_id">
            <Datagrid selectable={false}>
                <TextField source="body" />
                <DateField source="created_at" />
                <EditButton />
            </Datagrid>
        </ReferenceManyField>
        <TextField label="Nb views" source="views" />
    </Show>
);
