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
    TextField,
    TextInput,
    RichTextField,
    RichTextInput
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
            <TextField label="id" source="id" />
            <TextField label="title" source="title" />
            <RichTextField label="body" source="body" stripTags={true} />
            <DateField label="published_at" source="published_at" />
            <TextField label="average_note" source="average_note" />
            <TextField label="views" source="views" />
            <EditButton />
        </Datagrid>
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostEdit = (props) => (
    <Edit title={PostTitle} {...props}>
        <DisabledInput label="Id" source="id" />
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <RichTextInput label="Body" source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
        <ReferenceManyField label="Comments" reference="comments" target="post_id">
            <Datagrid selectable={false}>
                <TextField source="body" />
                <DateField source="created_at" />
                <EditButton />
            </Datagrid>
        </ReferenceManyField>
        <DisabledInput label="Nb views" source="views" />
    </Edit>
);

export const PostCreate = (props) => (
    <Create {...props}>
        <TextInput label="Title" source="title" />
        <TextInput label="Teaser" source="teaser" options={{ multiLine: true }} />
        <LongTextInput label="Body" source="body" />
        <DateInput label="Publication date" source="published_at" />
        <TextInput label="Average note" source="average_note" />
    </Create>
);
