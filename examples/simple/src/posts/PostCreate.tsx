import * as React from 'react';
import { useMemo } from 'react';
import RichTextInput from 'ra-input-rich-text';
import {
    ArrayInput,
    AutocompleteInput,
    BooleanInput,
    Create,
    DateInput,
    FormDataConsumer,
    NumberInput,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    required,
    FileInput,
    FileField,
    usePermissions,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import { FormSpy } from 'react-final-form';

const PostCreateToolbar = props => (
    <Toolbar {...props}>
        <SaveButton
            label="post.action.save_and_edit"
            redirect="edit"
            submitOnEnter={true}
        />
        <SaveButton
            label="post.action.save_and_show"
            redirect="show"
            submitOnEnter={false}
            variant="text"
        />
        <SaveButton
            label="post.action.save_and_add"
            redirect={false}
            submitOnEnter={false}
            variant="text"
        />
        <SaveButton
            label="post.action.save_with_average_note"
            transform={data => ({ ...data, average_note: 10 })}
            redirect="show"
            submitOnEnter={false}
            variant="text"
        />
    </Toolbar>
);

const backlinksDefaultValue = [
    {
        date: new Date(),
        url: 'http://google.com',
    },
];
const PostCreate = () => {
    const initialValues = useMemo(
        () => ({
            average_note: 0,
        }),
        []
    );
    const { permissions } = usePermissions();
    const dateDefaultValue = useMemo(() => new Date(), []);

    return (
        <Create>
            <SimpleForm
                toolbar={<PostCreateToolbar />}
                initialValues={initialValues}
                validate={values => {
                    const errors = {} as any;
                    ['title', 'teaser'].forEach(field => {
                        if (!values[field]) {
                            errors[field] = 'Required field';
                        }
                    });

                    if (values.average_note < 0 || values.average_note > 5) {
                        errors.average_note = 'Should be between 0 and 5';
                    }

                    return errors;
                }}
            >
                <FileInput
                    source="pdffile"
                    label="PDF-Template"
                    accept="application/pdf"
                >
                    <FileField source="src" title="title" />
                </FileInput>
                <TextInput autoFocus source="title" />
                <TextInput source="teaser" fullWidth={true} multiline={true} />
                <RichTextInput source="body" validate={required()} />
                <FormSpy subscription={{ values: true }}>
                    {({ values }) =>
                        values.title ? (
                            <NumberInput source="average_note" />
                        ) : null
                    }
                </FormSpy>

                <DateInput
                    source="published_at"
                    defaultValue={dateDefaultValue}
                />
                <BooleanInput source="commentable" defaultValue />
                <ArrayInput
                    source="backlinks"
                    defaultValue={backlinksDefaultValue}
                    validate={[required()]}
                >
                    <SimpleFormIterator>
                        <DateInput source="date" />
                        <TextInput source="url" />
                    </SimpleFormIterator>
                </ArrayInput>
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
                                    scopedFormData && scopedFormData.user_id ? (
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
            </SimpleForm>
        </Create>
    );
};

export default PostCreate;
