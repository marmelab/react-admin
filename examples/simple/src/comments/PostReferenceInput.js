import React, { Fragment, useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FormSpy } from 'react-final-form';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import {
    crudGetMatching,
    ReferenceInput,
    SelectInput,
    useTranslate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import PostQuickCreate from './PostQuickCreate';
import PostPreview from './PostPreview';

const useStyles = makeStyles({
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
});

const PostReferenceInput = props => {
    const translate = useTranslate();
    const classes = useStyles();
    const dispatch = useDispatch();

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [newPostId, setNewPostId] = useState('');

    useEffect(() => {
        //Refresh the choices of the ReferenceInput to ensure our newly created post
        // always appear, even after selecting another post
        dispatch(
            crudGetMatching(
                'posts',
                'comments@post_id',
                { page: 1, perPage: 25 },
                { field: 'id', order: 'DESC' },
                {}
            )
        );
    }, [dispatch, newPostId]);

    const handleNewClick = useCallback(
        event => {
            event.preventDefault();
            setShowCreateDialog(true);
        },
        [setShowCreateDialog]
    );

    const handleShowClick = useCallback(
        event => {
            event.preventDefault();
            setShowPreviewDialog(true);
        },
        [setShowPreviewDialog]
    );

    const handleCloseCreate = useCallback(() => {
        setShowCreateDialog(false);
    }, [setShowCreateDialog]);

    const handleCloseShow = useCallback(() => {
        setShowPreviewDialog(false);
    }, [setShowPreviewDialog]);

    const handleSave = useCallback(
        post => {
            setShowCreateDialog(false);
            setNewPostId(post.id);
        },
        [setShowCreateDialog, setNewPostId]
    );

    return (
        <Fragment>
            <ReferenceInput {...props} defaultValue={newPostId}>
                <SelectInput optionText="title" />
            </ReferenceInput>
            <Button
                data-testid="button-add-post"
                className={classes.button}
                onClick={handleNewClick}
            >
                {translate('ra.action.create')}
            </Button>
            <FormSpy
                subscription={{ values: true }}
                render={({ values }) =>
                    values.post_id ? (
                        <Fragment>
                            <Button
                                data-testid="button-show-post"
                                className={classes.button}
                                onClick={handleShowClick}
                            >
                                {translate('ra.action.show')}
                            </Button>
                            <Dialog
                                data-testid="dialog-show-post"
                                fullWidth
                                open={showPreviewDialog}
                                onClose={handleCloseShow}
                                aria-label={translate('simple.create-post')}
                            >
                                <DialogTitle>
                                    {translate('simple.create-post')}
                                </DialogTitle>
                                <DialogContent>
                                    <PostPreview
                                        id={values.post_id}
                                        basePath="/posts"
                                        resource="posts"
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button
                                        data-testid="button-close-modal"
                                        onClick={handleCloseShow}
                                    >
                                        {translate('simple.action.close')}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </Fragment>
                    ) : null
                }
            />
            <Dialog
                data-testid="dialog-add-post"
                fullWidth
                open={showCreateDialog}
                onClose={handleCloseCreate}
                aria-label={translate('simple.create-post')}
            >
                <DialogTitle>{translate('simple.create-post')}</DialogTitle>
                <DialogContent>
                    <PostQuickCreate
                        onCancel={handleCloseCreate}
                        onSave={handleSave}
                        basePath="/posts"
                        resource="posts"
                    />
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default PostReferenceInput;
