import * as React from 'react';
import { useMemo } from 'react';
import { RichTextInput } from 'ra-input-rich-text';
import {
    ArrayInput,
    AutocompleteInput,
    BooleanInput,
    Create,
    DateInput,
    FileField,
    FileInput,
    FormDataConsumer,
    maxValue,
    minValue,
    NumberInput,
    required,
    ReferenceInput,
    SaveButton,
    SelectInput,
    SimpleFormConfigurable,
    SimpleFormIterator,
    TextInput,
    Toolbar,
    useNotify,
    useRedirect,
    useCreate,
    useCreateSuggestionContext,
    CanAccess,
} from 'react-admin';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

const PostCreateToolbar = () => {
    const notify = useNotify();
    const redirect = useRedirect();
    const { reset } = useFormContext();

    return (
        <Toolbar>
            <SaveButton label="post.action.save_and_edit" variant="text" />
            <SaveButton
                label="post.action.save_and_show"
                type="button"
                variant="text"
                mutationOptions={{
                    onSuccess: data => {
                        notify('resources.posts.notifications.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                        redirect('show', 'posts', data.id);
                    },
                }}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
            />
            <SaveButton
                label="post.action.save_and_add"
                type="button"
                variant="text"
                mutationOptions={{
                    onSuccess: () => {
                        reset();
                        window.scrollTo(0, 0);
                        notify('resources.posts.notifications.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                    },
                }}
            />
            <SaveButton
                label="post.action.save_with_average_note"
                type="button"
                variant="text"
                mutationOptions={{
                    onSuccess: data => {
                        notify('resources.posts.notifications.created', {
                            type: 'info',
                            messageArgs: { smart_count: 1 },
                        });
                        redirect('show', 'posts', data.id);
                    },
                }}
                transform={data => ({ ...data, average_note: 10 })}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
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
    const dateDefaultValue = useMemo(() => new Date(), []);
    return (
        <Create redirect="edit">
            <SimpleFormConfigurable
                toolbar={<PostCreateToolbar />}
                defaultValues={defaultValues}
                sx={{ maxWidth: { md: 'auto', lg: '30em' } }}
            >
                <FileInput
                    source="pdffile"
                    label="PDF-Template"
                    accept={{ 'application/pdf': ['.pdf'] }}
                >
                    <FileField source="src" title="title" />
                </FileInput>
                <TextInput
                    autoFocus
                    source="title"
                    validate={required('Required field')}
                />
                <TextInput
                    source="teaser"
                    multiline
                    validate={required('Required field')}
                />
                <RichTextInput source="body" fullWidth validate={required()} />
                <DependantInput dependency="title">
                    <NumberInput
                        source="average_note"
                        validate={[
                            minValue(0, 'Should be between 0 and 5'),
                            maxValue(5, 'Should be between 0 and 5'),
                        ]}
                    />
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
                <CanAccess action="edit" resource="posts.authors">
                    <ArrayInput source="authors">
                        <SimpleFormIterator>
                            <ReferenceInput source="user_id" reference="users">
                                <AutocompleteInput
                                    label="User"
                                    create={<CreateUser />}
                                    openOnFocus={false}
                                />
                            </ReferenceInput>
                            <FormDataConsumer>
                                {({ scopedFormData }) =>
                                    scopedFormData && scopedFormData.user_id ? (
                                        <SelectInput
                                            source="role"
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
                                            label="Role"
                                        />
                                    ) : null
                                }
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </CanAccess>
            </SimpleFormConfigurable>
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

const CreateUser = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate();

    const handleSubmit = event => {
        event.preventDefault();
        create(
            'users',
            {
                data: {
                    name: value,
                },
            },
            {
                onSuccess: data => {
                    setValue('');
                    onCreate(data);
                },
            }
        );
    };

    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <TextInput
                        source="name"
                        defaultValue="Slim Shady"
                        autoFocus
                        validate={[required()]}
                    />
                    <AutocompleteInput
                        source="role"
                        choices={[
                            { id: '', name: 'None' },
                            { id: 'admin', name: 'Admin' },
                            { id: 'user', name: 'User' },
                            { id: 'user_simple', name: 'UserSimple' },
                        ]}
                        validate={[required()]}
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
