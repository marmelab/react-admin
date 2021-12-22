import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
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
    Record,
    ShowButton,
    TopToolbar,
    useCreateSuggestionContext,
    useCreate,
} from 'react-admin';

const PREFIX = 'CommentEdit';

const classes = {
    actions: `${PREFIX}-actions`,
    card: `${PREFIX}-card`,
};

const Root = styled('div')({
    [`& .${classes.actions}`]: {
        float: 'right',
    },
    [`& .${classes.card}`]: {
        marginTop: '1em',
        maxWidth: '30em',
    },
});

const LinkToRelatedPost = ({ record }: { record?: Record }) => (
    <RaLink to={`/posts/${record?.post_id}`}>
        <Typography variant="caption" color="inherit" align="right">
            See related post
        </Typography>
    </RaLink>
);

const OptionRenderer = ({ record, ...rest }: { record?: Record }) => {
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
    const { resource, record, redirect, save, version } = controllerProps;

    return (
        <EditContextProvider value={controllerProps}>
            <Root className="edit-page">
                <Title defaultTitle={`Comment #${record ? record.id : ''}`} />
                <div className={classes.actions}>
                    <TopToolbar>
                        <ShowButton record={record} />
                        {/* FIXME: added because react-router HashHistory cannot block navigation induced by address bar changes */}
                        <CreateButton resource="posts" label="Create post" />
                    </TopToolbar>
                </div>
                <Card className={classes.card}>
                    {record && (
                        <SimpleForm
                            redirect={redirect}
                            resource={resource}
                            record={record}
                            save={save}
                            version={version}
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
            </Root>
        </EditContextProvider>
    );
};

export default CommentEdit;
