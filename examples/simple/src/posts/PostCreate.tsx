import * as React from 'react';
import { useMemo } from 'react';
import { RichTextInput } from 'ra-input-rich-text';
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
    useNotify,
    usePermissions,
    useRedirect,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';

const PostCreateToolbar = props => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { reset } = useFormContext();

    return (
        <Toolbar {...props}>
            <SaveButton
                label="post.action.save_and_edit"
                submitOnEnter
                variant="text"
            />
            <SaveButton
                label="post.action.save_and_show"
                submitOnEnter={false}
                variant="text"
                mutationOptions={{
                    onSuccess: data => {
                        notify('ra.notification.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                        redirect('show', 'posts', data.id);
                    },
                }}
            />
            <SaveButton
                label="post.action.save_and_add"
                submitOnEnter={false}
                variant="text"
                mutationOptions={{
                    onSuccess: () => {
                        reset();
                        window.scrollTo(0, 0);
                        notify('ra.notification.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                    },
                }}
            />
            <SaveButton
                label="post.action.save_with_average_note"
                submitOnEnter={false}
                variant="text"
                mutationOptions={{
                    onSuccess: data => {
                        notify('ra.notification.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                        redirect('show', 'posts', data.id);
                    },
                }}
                transform={data => ({ ...data, average_note: 10 })}
            />
        </Toolbar>
    );
};

const backlinksDefaultValue = [
    {
        date: new Date(),
        url: 'http://google.com',
    },
];
const PostCreate = () => {
    const defaultValues = useMemo(
        () => ({
            average_note: 0,
        }),
        []
    );
    const { permissions } = usePermissions();
    const dateDefaultValue = useMemo(() => new Date(), []);
    return (
        <Create redirect="edit">
            <SimpleForm
                toolbar={<PostCreateToolbar />}
                defaultValues={defaultValues}
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
                <TextInput source="teaser" fullWidth multiline />
                <RichTextInput source="body" fullWidth validate={required()} />
                <DependantInput dependency="title">
                    <NumberInput source="average_note" />
                </DependantInput>

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
                        <DateInput source="date" defaultValue="" />
                        <TextInput source="url" defaultValue="" />
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

const DependantInput = ({
    dependency,
    children,
}: {
    dependency: string;
    children: JSX.Element;
}) => {
    const dependencyValue = useWatch({ name: dependency });

    return dependencyValue ? children : null;
};
