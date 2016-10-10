import React from 'react';
import {
    BooleanField,
    BooleanInput,
    Create,
    Datagrid,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    EditButton,
    FileInput,
    Filter,
    FormTab,
    List,
    LongTextInput,
    NumberField,
    NumberInput,
    SimpleForm,
    Show,
    ShowButton,
    ReferenceManyField,
    RichTextField,
    SimpleShowLayout,
    TabbedForm,
    TextField,
    TextInput,
} from 'admin-on-rest/mui';
import RichTextInput from 'aor-rich-text-input';
export PostIcon from 'material-ui/svg-icons/action/book';

const PostFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <TextInput label="Title" source="title" />
    </Filter>
);

export const PostList = (props) => (
    <List {...props} filter={<PostFilter />}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" style={{ maxWidth: '20em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}/>
            <DateField source="published_at" style={{ fontStyle: 'italic' }} />
            <BooleanField label="Commentable" source="commentable" />
            <NumberField source="views" />
            <EditButton />
            <ShowButton />
        </Datagrid>
    </List>
);

const PostTitle = ({ record }) => {
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

export const PostCreate = (props) => (
    <Create {...props}>
        <SimpleForm defaultValue={{ average_note: 0 }} validation={(values) => {
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
        }}>
            <TextInput source="title" />
            <TextInput label="Password (if protected post)" source="password" type="password" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <RichTextInput source="body" />
            <DateInput label="Publication date" source="published_at" defaultValue={new Date()} />
            <NumberInput source="average_note" />
            <BooleanInput label="Allow comments?" source="commentable" defaultValue={true} />
        </SimpleForm>
    </Create>
);

export const PostEdit = (props) => (
    <Edit title={<PostTitle />} {...props}>
        <TabbedForm defaultValue={{ average_note: 0 }}>
            <FormTab label="summary">
                <DisabledInput label="Id" source="id" />
                <TextInput source="title" validation={{ required: true }} />
                <LongTextInput source="teaser" validation={{ required: true }} />
                <FileInput source="picture" label="Preview Pictures" accept="image/*" />
            </FormTab>
            <FormTab label="body">
                <RichTextInput source="body" validation={{ required: true }} addLabel={false} />
            </FormTab>
            <FormTab label="Miscellaneous">
                <TextInput label="Password (if protected post)" source="password" type="password" />
                <DateInput label="Publication date" source="published_at" />
                <NumberInput source="average_note" validation={{ min: 0 }} />
                <BooleanInput label="Allow comments?" source="commentable" defaultValue />
                <DisabledInput label="Nb views" source="views" />
            </FormTab>
            <FormTab label="comments">
                <ReferenceManyField reference="comments" target="post_id" addLabel={false}>
                    <Datagrid>
                        <TextField source="body" />
                        <DateField source="created_at" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>
);

export const PostShow = (props) => (
    <Show title={<PostTitle />} {...props}>
        <SimpleShowLayout>
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
        </SimpleShowLayout>
    </Show>
);
