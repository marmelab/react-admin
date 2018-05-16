import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import {
    AutocompleteInput,
    DateInput,
    DisabledInput,
    EditActions,
    EditController,
    LongTextInput,
    ReferenceInput,
    SimpleForm,
    TextInput,
    minLength,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

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

const CommentEdit = withStyles(editStyles)(({ classes, ...props }) => (
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

export default CommentEdit;
