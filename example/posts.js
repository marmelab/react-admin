import React from 'react';
import {
    BooleanField,
    BooleanInput,
    CheckboxGroupInput,
    Create,
    Datagrid,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    EditButton,
    Filter,
    FormTab,
    ImageField,
    ImageInput,
    List,
    LongTextInput,
    NumberField,
    NumberInput,
    ReferenceManyField,
    RichTextField,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TabbedForm,
    TextField,
    TextInput,
} from 'admin-on-rest/mui';
import RichTextInput from 'aor-rich-text-input';
import { Translate } from 'admin-on-rest';
import Chip from 'material-ui/Chip';
export PostIcon from 'material-ui/svg-icons/action/book';

const QuickFilter = ({ label }) => <Chip>{ label }</Chip>;

const PostFilter = ({ ...props }) => (
    <Filter {...props}>
        <TextInput label="post.list.search" source="q" alwaysOn />
        <TextInput source="title" defaultValue="Qui tempore rerum et voluptates" />
        <QuickFilter source="commentable" defaultValue={true} />
    </Filter>
);

const titleFieldStyle = { maxWidth: '20em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
export const PostList = ({ ...props }) => (
    <List {...props} filters={<PostFilter />} sort={{ field: 'published_at', order: 'DESC' }}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" style={titleFieldStyle} />
            <DateField source="published_at" style={{ fontStyle: 'italic' }} />
            <BooleanField source="commentable" />
            <NumberField source="views" />
            <EditButton />
            <ShowButton />
        </Datagrid>
    </List>
);

const PostTitle = Translate(({ record, translate }) => {
    return <span>{record ? translate('post.edit.title', { title: record.title }) : ''}</span>;
});

export const PostCreate = ({ ...props }) => (
    <Create {...props}>
        <SimpleForm defaultValue={{ average_note: 0 }} validation={(values) => {
            const errors = {};
            ['title', 'teaser'].forEach((field) => {
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
            <TextInput source="password" type="password" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <RichTextInput source="body" />
            <DateInput source="published_at" defaultValue={() => new Date()} />
            <NumberInput source="average_note" />
            <BooleanInput source="commentable" defaultValue={true} />
        </SimpleForm>
    </Create>
);

export const PostEdit = ({ ...props }) => (
    <Edit title={<PostTitle />} {...props}>
        <TabbedForm defaultValue={{ average_note: 0 }}>
            <FormTab label="post.form.summary">
                <DisabledInput source="id" />
                <TextInput source="title" validation={{ required: true }} />
                <CheckboxGroupInput
                    source="notifications"
                    choices={[
                        { id: 12, name: 'Ray Hakt' },
                        { id: 31, name: 'Ann Gullar' },
                        { id: 42, name: 'Sean Phonee' },
                    ]}
                />
                <LongTextInput source="teaser" validation={{ required: true }} />
                <ImageInput multiple source="pictures" accept="image/*">
                    <ImageField source="src" title="title" />
                </ImageInput>
            </FormTab>
            <FormTab label="post.form.body">
                <RichTextInput source="body" label="" validation={{ required: true }} addLabel={false} />
            </FormTab>
            <FormTab label="post.form.miscellaneous">
                <TextInput source="password" type="password" />
                <DateInput source="published_at" />
                <NumberInput source="average_note" validation={{ min: 0 }} />
                <BooleanInput source="commentable" defaultValue />
                <DisabledInput source="views" />
            </FormTab>
            <FormTab label="post.form.comments">
                <ReferenceManyField reference="comments" target="post_id" addLabel={false}>
                    <Datagrid>
                        <TextField source="body" label="resources.comments.fields.body" />
                        <DateField source="created_at" label="resources.comments.fields.created_at" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>
);

export const PostShow = ({ ...props }) => (
    <Show title={<PostTitle />} {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="teaser" />
            <RichTextField source="body" stripTags={false} />
            <DateField source="published_at" style={{ fontStyle: 'italic' }} />
            <TextField source="average_note" />
            <ReferenceManyField label="resources.posts.fields.comments" reference="comments" target="post_id" sort={{ field: 'created_at', order: 'DESC' }}>
                <Datagrid selectable={false}>
                    <TextField source="body" label="resources.comments.fields.body" />
                    <DateField source="created_at" label="resources.comments.fields.created_at" />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
            <TextField source="views" />
        </SimpleShowLayout>
    </Show>
);
