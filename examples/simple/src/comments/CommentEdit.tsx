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
    ShowButton,
    TopToolbar,
    useCreateSuggestionContext,
    useCreate,
    useCreatePath,
    useRecordContext,
} from 'react-admin';

const LinkToRelatedPost = () => {
    const record = useRecordContext();
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

const OptionRenderer = (props: any) => {
    const record = useRecordContext();
    return record.id === '@@ra-create' ? (
        <div {...props}>{record.name}</div>
    ) : (
        <div {...props}>
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
                <Title defaultTitle={controllerProps.defaultTitle} />
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
                                    fullWidth
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
