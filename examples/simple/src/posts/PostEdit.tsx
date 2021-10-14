import RichTextInput from 'ra-input-rich-text';
import * as React from 'react';
import {
    TopToolbar,
    AutocompleteInput,
    ArrayInput,
    BooleanInput,
    CheckboxGroupInput,
    Datagrid,
    DateField,
    DateInput,
    Edit,
    CloneButton,
    ShowButton,
    EditButton,
    FormTab,
    ImageField,
    ImageInput,
    NumberInput,
    ReferenceManyField,
    ReferenceInput,
    SelectInput,
    SimpleFormIterator,
    TabbedForm,
    TextField,
    TextInput,
    minValue,
    number,
    required,
    FormDataConsumer,
    useCreateSuggestionContext,
    EditActionsProps,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import {
    Box,
    BoxProps,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    TextField as MuiTextField,
} from '@material-ui/core';

import PostTitle from './PostTitle';
import TagReferenceInput from './TagReferenceInput';

const CreateCategory = ({
    onAddChoice,
}: {
    onAddChoice: (record: any) => void;
}) => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const choice = { name: value, id: value.toLowerCase() };
        onAddChoice(choice);
        onCreate(choice);
        setValue('');
        return false;
    };
    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <MuiTextField
                        label="New Category"
                        value={value}
                        onChange={event => setValue(event.target.value)}
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button type="submit">Save</Button>
                    <Button onClick={onCancel}>Cancel</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const EditActions = ({ basePath, data, hasShow }: EditActionsProps) => (
    <TopToolbar>
        <CloneButton
            className="button-clone"
            basePath={basePath}
            record={data}
        />
        {hasShow && <ShowButton basePath={basePath} record={data} />}
    </TopToolbar>
);

const SanitizedBox = ({
    fullWidth,
    basePath,
    ...props
}: BoxProps & { fullWidth?: boolean; basePath?: string }) => <Box {...props} />;

const categories = [
    { name: 'Tech', id: 'tech' },
    { name: 'Lifestyle', id: 'lifestyle' },
];

const PostEdit = ({ permissions, ...props }) => {
    return (
        <Edit title={<PostTitle />} actions={<EditActions />} {...props}>
            <TabbedForm
                initialValues={{ average_note: 0 }}
                warnWhenUnsavedChanges
            >
                <FormTab label="post.form.summary">
                    <SanitizedBox
                        display="flex"
                        flexDirection="column"
                        width="100%"
                        justifyContent="space-between"
                        fullWidth
                    >
                        <TextInput disabled source="id" />
                        <TextInput
                            source="title"
                            validate={required()}
                            resettable
                        />
                    </SanitizedBox>
                    <TextInput
                        multiline={true}
                        fullWidth={true}
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
                    <ImageInput multiple source="pictures" accept="image/*">
                        <ImageField source="src" title="title" />
                    </ImageInput>
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
                                        scopedFormData &&
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
                    <TagReferenceInput
                        reference="tags"
                        source="tags"
                        label="Tags"
                    />
                    <ArrayInput source="backlinks">
                        <SimpleFormIterator>
                            <DateInput source="date" />
                            <TextInput source="url" validate={required()} />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <DateInput
                        source="published_at"
                        options={{ locale: 'pt' }}
                    />
                    <SelectInput
                        create={
                            <CreateCategory
                                // Added on the component because we have to update the choices
                                // ourselves as we don't use a ReferenceInput
                                onAddChoice={choice => categories.push(choice)}
                            />
                        }
                        allowEmpty
                        resettable
                        source="category"
                        choices={categories}
                    />
                    <NumberInput
                        source="average_note"
                        validate={[required(), number(), minValue(0)]}
                    />
                    <BooleanInput source="commentable" defaultValue />
                    <TextInput disabled source="views" />
                </FormTab>
                <FormTab label="post.form.comments">
                    <ReferenceManyField
                        reference="comments"
                        target="post_id"
                        addLabel={false}
                        fullWidth
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
};

export default PostEdit;
