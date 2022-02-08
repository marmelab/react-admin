import * as React from 'react';
import {
    Box,
    Card,
    Typography,
    Dialog,
    DialogContent,
    TextField as MuiTextField,
    DialogActions,
    Button,
} from '@mui/material';
import {
    AutocompleteInput,
    CreateButton,
    DateInput,
    EditContextProvider,
    useEditController,
    Link as RaLink,
    ReferenceInput,
    SimpleForm,
    TextInput,
    Title,
    minLength,
    RaRecord,
    ShowButton,
    TopToolbar,
    useCreateSuggestionContext,
    useCreate,
    useCreatePath,
} from 'react-admin';

const LinkToRelatedPost = ({ record }: { record?: RaRecord }) => {
    const createPath = useCreatePath();
    return (
        <RaLink
            to={createPath({
                type: 'edit',
                resource: 'posts',
                id: record?.post_id,
            })}
        >
            <Typography variant="caption" color="inherit" align="right">
                See related post
            </Typography>
        </RaLink>
    );
};

const OptionRenderer = ({ record, ...rest }: { record?: RaRecord }) => {
    return record.id === '@@ra-create' ? (
        <div {...rest}>{record.name}</div>
    ) : (
        <div {...rest}>
            {record?.title} - {record?.id}
        </div>
    );
};

const inputText = record =>
    record.id === '@@ra-create'
        ? record.name
        : `${record.title} - ${record.id}`;

const CreatePost = () => {
    const { filter, onCancel, onCreate } = useCreateSuggestionContext();
    const [value, setValue] = React.useState(filter || '');
    const [create] = useCreate();
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        create(
            'posts',
            {
                data: {
                    title: value,
                },
            },
            {
                onSuccess: data => {
                    setValue('');
                    const choice = data;
                    onCreate(choice);
                },
            }
        );
        return false;
    };
    return (
        <Dialog open onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <MuiTextField
                        label="New post title"
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

const CommentEdit = props => {
    const controllerProps = useEditController(props);
    const { resource, record, save } = controllerProps;

    return (
        <EditContextProvider value={controllerProps}>
            <div className="edit-page">
                <Title defaultTitle={`Comment #${record ? record.id : ''}`} />
                <Box sx={{ float: 'right' }}>
                    <TopToolbar>
                        <ShowButton record={record} />
                        {/* FIXME: added because react-router HashHistory cannot block navigation induced by address bar changes */}
                        <CreateButton resource="posts" label="Create post" />
                    </TopToolbar>
                </Box>
                <Card sx={{ marginTop: '1em', maxWidth: '30em' }}>
                    {record && (
                        <SimpleForm
                            resource={resource}
                            record={record}
                            onSubmit={save}
                            warnWhenUnsavedChanges
                        >
                            <TextInput disabled source="id" fullWidth />
                            <ReferenceInput
                                source="post_id"
                                reference="posts"
                                perPage={15}
                                sort={{ field: 'title', order: 'ASC' }}
                                fullWidth
                            >
                                <AutocompleteInput
                                    create={<CreatePost />}
                                    matchSuggestion={(
                                        filterValue,
                                        suggestion
                                    ) => {
                                        const title = `${suggestion.title} - ${suggestion.id}`;
                                        return title.includes(filterValue);
                                    }}
                                    optionText={<OptionRenderer />}
                                    inputText={inputText}
                                />
                            </ReferenceInput>

                            <LinkToRelatedPost />
                            <TextInput
                                source="author.name"
                                validate={minLength(10)}
                                fullWidth
                            />
                            <DateInput source="created_at" fullWidth />
                            <TextInput
                                source="body"
                                validate={minLength(10)}
                                fullWidth={true}
                                multiline={true}
                            />
                        </SimpleForm>
                    )}
                </Card>
            </div>
        </EditContextProvider>
    );
};

export default CommentEdit;
