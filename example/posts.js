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

const PostFilter = Translate(({ translate, ...props }) => (
    <Filter {...props}>
        <TextInput label={translate('post.list.search')} source="q" alwaysOn />
        <TextInput label={translate('post.list.title')} source="title" defaultValue="Qui tempore rerum et voluptates" />
        <QuickFilter label={translate('post.list.commentable')} source="commentable" defaultValue={true} />
    </Filter>
));

const titleFieldStyle = { maxWidth: '20em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
export const PostList = Translate(({ translate, ...props }) => (
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
));

const PostTitle = Translate(({ record, translate }) => {
    return <span>{record ? translate('post.title.edit', { title: record.title }) : ''}</span>;
});

export const PostCreate = Translate(({ translate, ...props }) => (
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
            <TextInput source="title" label={translate('post.form.title')} />
            <TextInput label={translate('post.form.password')} source="password" type="password" />
            <TextInput source="teaser" label={translate('post.form.teaser')} options={{ multiLine: true }} />
            <RichTextInput source="body" label={translate('post.form.body')} />
            <DateInput label={translate('post.form.published_at')} source="published_at" defaultValue={() => new Date()} />
            <NumberInput source="average_note" label={translate('post.form.average_note')} />
            <BooleanInput label={translate('post.form.allow_comments')} source="commentable" defaultValue={true} />
        </SimpleForm>
    </Create>
));

export const PostEdit = Translate(({ translate, ...props }) => (
    <Edit title={<PostTitle />} {...props}>
        <TabbedForm defaultValue={{ average_note: 0 }}>
            <FormTab label={translate('post.form.summary')}>
                <DisabledInput label="Id" source="id" />
                <TextInput source="title" label={translate('post.form.title')} validation={{ required: true }} />
                <CheckboxGroupInput
                    source="notifications"
                    label="Notification recipients"
                    choices={[
                        { id: 12, name: 'Ray Hakt' },
                        { id: 31, name: 'Ann Gullar' },
                        { id: 42, name: 'Sean Phonee' },
                    ]}
                />
                <LongTextInput source="teaser" label={translate('post.form.teaser')} validation={{ required: true }} />
                <ImageInput multiple source="pictures" label={translate('post.form.pictures')} accept="image/*">
                    <ImageField source="src" title="title" />
                </ImageInput>
            </FormTab>
            <FormTab label={translate('post.form.body')}>
                <RichTextInput source="body" label={translate('post.form.body')} validation={{ required: true }} addLabel={false} />
            </FormTab>
            <FormTab label={translate('post.form.miscellaneous')}>
                <TextInput label={translate('post.form.password')} source="password" type="password" />
                <DateInput label={translate('post.form.published_at')} source="published_at" />
                <NumberInput source="average_note" label={translate('post.form.average_note')} validation={{ min: 0 }} />
                <BooleanInput label={translate('post.form.allow_comments')} source="commentable" defaultValue />
                <DisabledInput label={translate('post.form.nb_view')} source="views" />
            </FormTab>
            <FormTab label={translate('post.form.comments')}>
                <ReferenceManyField reference="comments" target="post_id" addLabel={false}>
                    <Datagrid>
                        <TextField source="body" label={translate('post.form.body')} />
                        <DateField source="created_at" label={translate('post.form.created_at')} />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>
));

export const PostShow = Translate(({ translate, ...props }) => (
    <Show title={<PostTitle />} {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" label={translate('post.form.title')} />
            <TextField source="teaser" label={translate('post.form.teaser')} />
            <RichTextField source="body" label={translate('post.form.body')} stripTags={false} />
            <DateField source="published_at" label={translate('post.form.published_at')} style={{ fontStyle: 'italic' }} />
            <TextField source="average_note" label={translate('post.form.average_note')} />
            <ReferenceManyField label={translate('post.form.comments')} reference="comments" target="post_id" sort={{ field: 'created_at', order: 'DESC' }}>
                <Datagrid selectable={false}>
                    <TextField source="body" label={translate('post.form.body')} />
                    <DateField source="created_at" label={translate('post.form.created_at')} />
                    <EditButton />
                </Datagrid>
            </ReferenceManyField>
            <TextField label={translate('post.form.nb_view')} source="views" />
        </SimpleShowLayout>
    </Show>
));
