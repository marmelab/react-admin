import React from 'react';
import {
    AutocompleteInput,
    Create,
    DateField,
    DateInput,
    DisabledInput,
    EditActions,
    EditController,
    EditButton,
    Filter,
    List,
    LongTextInput,
    ReferenceField,
    ReferenceInput,
    Responsive,
    SelectInput,
    SimpleList,
    SimpleForm,
    TextField,
    TextInput,
    minLength,
    translate,
    Show,
    ShowButton,
    SimpleShowLayout,
    required,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import PersonIcon from 'material-ui-icons/Person';
import Avatar from 'material-ui/Avatar';
import Card, { CardActions, CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';
import ChatBubbleIcon from 'material-ui-icons/ChatBubble';
export const CommentIcon = ChatBubbleIcon;

const CommentFilter = props => (
    <Filter {...props}>
        <ReferenceInput source="post_id" reference="posts">
            <SelectInput optionText="title" />
        </ReferenceInput>
    </Filter>
);

const CommentPagination = translate(
    ({ page, perPage, total, setPage, translate }) => {
        const nbPages = Math.ceil(total / perPage) || 1;
        return (
            nbPages > 1 && (
                <Toolbar>
                    {page > 1 && (
                        <Button
                            color="primary"
                            key="prev"
                            onClick={() => setPage(page - 1)}
                        >
                            <ChevronLeft />&nbsp;
                            {translate('ra.navigation.prev')}
                        </Button>
                    )}
                    {page !== nbPages && (
                        <Button
                            color="primary"
                            key="next"
                            onClick={() => setPage(page + 1)}
                        >
                            {translate('ra.navigation.next')}&nbsp;
                            <ChevronRight />
                        </Button>
                    )}
                </Toolbar>
            )
        );
    }
);

const listStyles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: theme.typography.body1,
    cardLink: {
        ...theme.typography.body1,
        flexGrow: 1,
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
});

const CommentGrid = withStyles(listStyles)(
    translate(({ classes, ids, data, basePath, translate }) => (
        <Grid spacing={16} container style={{ padding: '1em' }}>
            {ids.map(id => (
                <Grid spacing={16} item key={id} sm={12} md={6} lg={4}>
                    <Card className={classes.card}>
                        <CardHeader
                            title={
                                <TextField
                                    record={data[id]}
                                    source="author.name"
                                />
                            }
                            subheader={
                                <DateField
                                    record={data[id]}
                                    source="created_at"
                                />
                            }
                            avatar={
                                <Avatar>
                                    <PersonIcon />
                                </Avatar>
                            }
                        />
                        <CardContent className={classes.cardContent}>
                            <TextField record={data[id]} source="body" />
                        </CardContent>
                        <CardContent className={classes.cardLink}>
                            {translate('comment.list.about')}&nbsp;
                            <ReferenceField
                                resource="comments"
                                record={data[id]}
                                source="post_id"
                                reference="posts"
                                basePath={basePath}
                            >
                                <TextField source="title" />
                            </ReferenceField>
                        </CardContent>
                        <CardActions className={classes.cardActions}>
                            <EditButton
                                resource="posts"
                                basePath={basePath}
                                record={data[id]}
                            />
                            <ShowButton
                                resource="posts"
                                basePath={basePath}
                                record={data[id]}
                            />
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    ))
);

CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

const CommentMobileList = props => (
    <SimpleList
        primaryText={record => record.author.name}
        secondaryText={record => record.body}
        tertiaryText={record =>
            new Date(record.created_at).toLocaleDateString()}
        leftAvatar={() => <PersonIcon />}
        {...props}
    />
);

export const CommentList = props => (
    <List
        {...props}
        perPage={6}
        filters={<CommentFilter />}
        pagination={<CommentPagination />}
    >
        <Responsive small={<CommentMobileList />} medium={<CommentGrid />} />
    </List>
);

const editStyles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    actions: {
        height: 'auto',
    },
    card: {
        marginTop: '1em',
        maxWidth: '30em',
    },
};

export const CommentEdit = withStyles(editStyles)(({ classes, ...props }) => (
    <EditController {...props}>
        {({ resource, record, redirect, save, basePath, version }) => (
            <div className="edit-page">
                <div className={classes.header}>
                    <Typography variant="headline">
                        Comment #{record && record.id}
                    </Typography>
                    <EditActions
                        basePath={basePath}
                        resource={resource}
                        data={record}
                        hasShow
                        hasList
                        className={classes.actions}
                    />
                </div>
                <Card className={classes.card}>
                    {record && (
                        <SimpleForm
                            basePath={basePath}
                            redirect={redirect}
                            resource={resource}
                            record={record}
                            save={save}
                            version={version}
                        >
                            <DisabledInput source="id" fullWidth />
                            <ReferenceInput
                                source="post_id"
                                reference="posts"
                                perPage={15}
                                sort={{ field: 'title', order: 'ASC' }}
                                fullWidth
                            >
                                <AutocompleteInput
                                    optionText="title"
                                    options={{ fullWidth: true }}
                                />
                            </ReferenceInput>
                            <TextInput
                                source="author.name"
                                validate={minLength(10)}
                                fullWidth
                            />
                            <DateInput source="created_at" fullWidth />
                            <LongTextInput
                                source="body"
                                validate={minLength(10)}
                                fullWidth
                            />
                        </SimpleForm>
                    )}
                </Card>
            </div>
        )}
    </EditController>
));

const defaultValue = { created_at: new Date() };
export const CommentCreate = props => (
    <Create {...props}>
        <SimpleForm defaultValue={defaultValue}>
            <ReferenceInput
                source="post_id"
                reference="posts"
                allowEmpty
                validate={required()}
            >
                <SelectInput optionText="title" />
            </ReferenceInput>
            <DateInput source="created_at" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Create>
);

export const CommentShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="post_id" reference="posts">
                <TextField source="title" />
            </ReferenceField>
            <TextField source="author.name" />
            <DateField source="created_at" />
            <TextField source="body" />
        </SimpleShowLayout>
    </Show>
);
