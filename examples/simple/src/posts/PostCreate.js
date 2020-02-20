import React, { useCallback, useMemo } from 'react';
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
    useCreate,
    useRedirect,
    useNotify,
} from 'react-admin'; // eslint-disable-line import/no-unresolved
import { useFormState, FormSpy } from 'react-final-form';

const SaveWithNoteButton = props => {
    const [create] = useCreate('posts');
    const redirectTo = useRedirect();
    const notify = useNotify();
    const { basePath, redirect } = props;

    const formState = useFormState();
    const handleClick = useCallback(() => {
        if (!formState.valid) {
            return;
        }

        create(
            {
                payload: {
                    data: { ...formState.values, average_note: 10 },
                },
            },
            {
                onSuccess: ({ data: newRecord }) => {
                    notify('ra.notification.created', 'info', {
                        smart_count: 1,
                    });
                    redirectTo(redirect, basePath, newRecord.id, newRecord);
                },
            }
        );
    }, [
        formState.valid,
        formState.values,
        create,
        notify,
        redirectTo,
        redirect,
        basePath,
    ]);

    return <SaveButton {...props} handleSubmitWithRedirect={handleClick} />;
};

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
        <SaveWithNoteButton
            label="post.action.save_with_average_note"
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
const PostCreate = ({ permissions, ...props }) => {
    const initialValues = useMemo(
        () => ({
            average_note: 0,
        }),
        []
    );

    const dateDefaultValue = useMemo(() => new Date(), []);

    return (
        <Create {...props}>
            <SimpleForm
                toolbar={<PostCreateToolbar />}
                initialValues={initialValues}
                validate={values => {
                    const errors = {};
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
