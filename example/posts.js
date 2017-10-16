import React from 'react';
import {
    BooleanField,
    BooleanInput,
    CheckboxGroupInput,
    ChipField,
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
    ReferenceArrayField,
    ReferenceManyField,
    ReferenceArrayInput,
    Responsive,
    RichTextField,
    SaveButton,
    SelectArrayInput,
    SelectField,
    SelectInput,
    Show,
    ShowButton,
    SimpleForm,
    SimpleList,
    SingleFieldList,
    Tab,
    TabbedForm,
    TabbedShowLayout,
    TextField,
    TextInput,
    Toolbar,
    minValue,
    number,
    required,
    translate,
} from 'admin-on-rest'; // eslint-disable-line import/no-unresolved
import RichTextInput from 'aor-rich-text-input';
import Chip from 'material-ui/Chip';

export PostIcon from 'material-ui/svg-icons/action/book';

const QuickFilter = translate(({ label, translate }) =>
    <Chip style={{ marginBottom: 8 }}>
        {translate(label)}
    </Chip>
);

const PostFilter = ({ ...props }) =>
    <Filter {...props}>
        <TextInput label="post.list.search" source="q" alwaysOn />
        <TextInput
            source="title"
            defaultValue="Qui tempore rerum et voluptates"
        />
        <ReferenceArrayInput source="tags" reference="tags" defaultValue={[3]}>
            <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
        <QuickFilter
            label="resources.posts.fields.commentable"
            source="commentable"
            defaultValue
        />
    </Filter>;

const titleFieldStyle = {
    maxWidth: '20em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
};
export const PostList = ({ ...props }) =>
    <List
        {...props}
        filters={<PostFilter />}
        sort={{ field: 'published_at', order: 'DESC' }}
    >
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    tertiaryText={record =>
                        new Date(record.published_at).toLocaleDateString()}
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="title" style={titleFieldStyle} />
                    <DateField
                        source="published_at"
                        style={{ fontStyle: 'italic' }}
                    />
                    <BooleanField
                        source="commentable"
                        label="resources.posts.fields.commentable_short"
                    />
                    <NumberField source="views" />
                    <ReferenceArrayField
                        label="Tags"
                        reference="tags"
                        source="tags"
                    >
                        <SingleFieldList>
                            <ChipField source="name" />
                        </SingleFieldList>
                    </ReferenceArrayField>
                    <EditButton />
                    <ShowButton />
                </Datagrid>
            }
        />
    </List>;

const PostTitle = translate(({ record, translate }) =>
    <span>
        {record ? translate('post.edit.title', { title: record.title }) : ''}
    </span>
);

const PostCreateToolbar = props =>
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
            raised={false}
        />
    </Toolbar>;

export const PostCreate = ({ ...props }) =>
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
            <TextInput source="password" type="password" />
            <TextInput source="teaser" options={{ multiLine: true }} />
            <RichTextInput source="body" />
            <DateInput source="published_at" defaultValue={() => new Date()} />
            <NumberInput source="average_note" />
            <BooleanInput source="commentable" defaultValue />
        </SimpleForm>
    </Create>;

const emptyKeycode = [];

export const PostEdit = ({ ...props }) =>
    <Edit title={<PostTitle />} {...props}>
        <TabbedForm defaultValue={{ average_note: 0 }}>
            <FormTab label="post.form.summary">
                <DisabledInput source="id" />
                <TextInput source="title" validate={required} />
                <CheckboxGroupInput
                    source="notifications"
                    choices={[
                        { id: 12, name: 'Ray Hakt' },
                        { id: 31, name: 'Ann Gullar' },
                        { id: 42, name: 'Sean Phonee' },
                    ]}
                />
                <LongTextInput source="teaser" validate={required} />
                <ImageInput multiple source="pictures" accept="image/*">
                    <ImageField source="src" title="title" />
                </ImageInput>
            </FormTab>
            <FormTab label="post.form.body">
                <RichTextInput
                    source="body"
                    label=""
                    validate={required}
                    addLabel={false}
                />
            </FormTab>
            <FormTab label="post.form.miscellaneous">
                <ReferenceArrayInput source="tags" reference="tags" allowEmpty>
                    <SelectArrayInput
                        optionText="name"
                        options={{
                            fullWidth: true,
                            newChipKeyCodes: emptyKeycode,
                        }}
                    />
                </ReferenceArrayInput>
                <DateInput source="published_at" options={{ locale: 'pt' }} />
                <SelectInput
                    source="category"
                    choices={[
                        { name: 'Tech', id: 'tech' },
                        { name: 'Lifestyle', id: 'lifestyle' },
                    ]}
                />
                <NumberInput
                    source="average_note"
                    validate={[required, number, minValue(0)]}
                />
                <BooleanInput source="commentable" defaultValue />
                <DisabledInput source="views" />
            </FormTab>
            <FormTab label="post.form.comments">
                <ReferenceManyField
                    reference="comments"
                    target="post_id"
                    addLabel={false}
                >
                    <Datagrid>
                        <DateField source="created_at" />
                        <TextField source="author.name" />
                        <TextField source="body" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </FormTab>
        </TabbedForm>
    </Edit>;

export const PostShow = ({ ...props }) =>
    <Show title={<PostTitle />} {...props}>
        <TabbedShowLayout>
            <Tab label="post.form.summary">
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="teaser" />
            </Tab>
            <Tab label="post.form.body">
                <RichTextField
                    source="body"
                    stripTags={false}
                    label=""
                    addLabel={false}
                />
            </Tab>
            <Tab label="post.form.miscellaneous">
                <ReferenceArrayField reference="tags" source="tags">
                    <SingleFieldList>
                        <ChipField source="name" />
                    </SingleFieldList>
                </ReferenceArrayField>
                <DateField source="published_at" />
                <SelectField
                    source="category"
                    choices={[
                        { name: 'Tech', id: 'tech' },
                        { name: 'Lifestyle', id: 'lifestyle' },
                    ]}
                />
                <NumberField source="average_note" />
                <BooleanField source="commentable" />
                <TextField source="views" />
            </Tab>
            <Tab label="post.form.comments">
                <ReferenceManyField
                    label="resources.posts.fields.comments"
                    reference="comments"
                    target="post_id"
                    sort={{ field: 'created_at', order: 'DESC' }}
                >
                    <Datagrid selectable={false}>
                        <DateField source="created_at" />
                        <TextField source="author.name" />
                        <TextField source="body" />
                        <EditButton />
                    </Datagrid>
                </ReferenceManyField>
            </Tab>
        </TabbedShowLayout>
    </Show>;
