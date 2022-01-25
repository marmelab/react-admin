import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Fragment, useState, useCallback } from 'react';
import { FormSpy, useForm } from 'react-final-form';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useQueryClient } from 'react-query';

import { ReferenceInput, SelectInput, useTranslate } from 'react-admin'; // eslint-disable-line import/no-unresolved

import PostQuickCreate from './PostQuickCreate';
import PostPreview from './PostPreview';

const PREFIX = 'PostReferenceInput';

const classes = {
    button: `${PREFIX}-button`,
};

const Root = styled('div')({
    [`& .${classes.button}`]: {
        margin: '10px 24px',
        position: 'relative',
    },
});

const PostReferenceInput = props => {
    const translate = useTranslate();
    const queryClient = useQueryClient();
    const { change } = useForm();

    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [newPostId, setNewPostId] = useState('');

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
            change('post_id', post.id);
            queryClient.invalidateQueries(['posts', 'getList']);
        },
        [setShowCreateDialog, setNewPostId, change, queryClient]
    );

    return (
        <Root>
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
                        resource="posts"
                    />
                </DialogContent>
            </Dialog>
        </Root>
    );
};

export default PostReferenceInput;
