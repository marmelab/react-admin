import RichTextInput from 'ra-input-rich-text';
import React from 'react';
import {
    AutocompleteArrayInput,
    ArrayInput,
    BooleanInput,
    CheckboxGroupInput,
    Datagrid,
    DateField,
    DateInput,
    DisabledInput,
    Edit,
    CardActions,
    CloneButton,
    ShowButton,
    EditButton,
    FormTab,
    ImageField,
    ImageInput,
    LongTextInput,
    NumberInput,
    ReferenceArrayInput,
    ReferenceManyField,
    SelectInput,
    SimpleFormIterator,
    TabbedForm,
    TextField,
    TextInput,
    minValue,
    number,
    required,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import PostTitle from './PostTitle';

const EditActions = ({
    basePath,
    className,
    data,
    hasShow,
    hasList,
    resource,
    ...rest
}) => (
        <CardActions className={className} {...rest}>
            <CloneButton
                className="button-clone"
                basePath={basePath}
                record={data}
            />
            {hasShow && <ShowButton basePath={basePath} record={data} />}
        </CardActions>
    );

const PostEdit = props => (
    <Edit title={<PostTitle />} actions={<EditActions />} {...props}>
        <TabbedForm defaultValue={{ average_note: 0 }}>
            <FormTab label="post.form.summary">
                <DisabledInput source="id" />
                <TextInput source="title" validate={required()} resettable />
                <LongTextInput
                    source="teaser"
                    validate={required()}
                    resettable
                />
                <CheckboxGroupInput
                    source="notifications"
                    choices={[
                        { id: 12, name: 'Ray Hakt' },
                        { id: 31, name: 'Ann Gullar' },
                        { id: 42, name: 'Sean Phonee' },
                    ]}
                />
                <ImageInput multiple source="pictures" accept="image/*" validate={required()}>
                    <ImageField source="src" title="title" />
                </ImageInput>
            </FormTab>
            <FormTab label="post.form.body">
                <RichTextInput
                    source="body"
                    label=""
                    validate={required()}
                    addLabel={false}
                />
            </FormTab>
            <FormTab label="post.form.miscellaneous">
                <ReferenceArrayInput reference="tags" source="tags" filter={{ published: true }}>
                    <AutocompleteArrayInput />
                </ReferenceArrayInput>
                <ArrayInput source="backlinks">
                    <SimpleFormIterator>
                        <DateInput source="date" />
                        <TextInput source="url" />
                    </SimpleFormIterator>
                </ArrayInput>
                <DateInput source="published_at" options={{ locale: 'pt' }} />
                <SelectInput
                    resettable
                    source="category"
                    choices={[
                        { name: 'Tech', id: 'tech' },
                        { name: 'Lifestyle', id: 'lifestyle' },
                    ]}
                />
                <NumberInput
                    source="average_note"
                    validate={[required(), number(), minValue(0)]}
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
    </Edit>
);

export default PostEdit;
