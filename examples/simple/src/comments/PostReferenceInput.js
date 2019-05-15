import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Field } from 'redux-form';

import { makeStyles } from '@material-ui/styles';
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

    const [state, setState] = React.useState({
        showCreateDialog: false,
        showPreviewDialog: false,
        new_post_id: '',
    });

    React.useEffect(
        () => {
            //Refresh the choices of the ReferenceInput to ensure our newly created post
            // always appear, even after selecting another post
            dispatch(
                crudGetMatching(
                    'posts',
                    'comments@post_id',
                    { page: 1, perPage: 25 },
                    { field: 'id', order: 'DESC' },
                    {},
                ),
            );
        },
        [state.new_post_id],
    );

    const handleNewClick = event => {
        event.preventDefault();
        setState({ ...state, showCreateDialog: true });
    };

    const handleShowClick = event => {
        event.preventDefault();
        setState({ ...state, showPreviewDialog: true });
    };

    const handleCloseCreate = () => {
        setState({ ...state, showCreateDialog: false });
    };

    const handleCloseShow = () => {
        setState({ ...state, showPreviewDialog: false });
    };

    const handleSave = post => {
        setState({ ...state, showCreateDialog: false, new_post_id: post.id });
    };

    return (
        <Fragment>
            <ReferenceInput {...props} defaultValue={state.new_post_id}>
                <SelectInput optionText="title" />
            </ReferenceInput>
            <Button
                data-testid="button-add-post"
                className={classes.button}
                onClick={handleNewClick}
            >
                {translate('ra.action.create')}
            </Button>
            <Field
                name="post_id"
                component={({ input }) =>
                    input.value && (
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
                                open={state.showPreviewDialog}
                                onClose={handleCloseShow}
                                aria-label={translate('simple.create-post')}
                            >
                                <DialogTitle>
                                    {translate('simple.create-post')}
                                </DialogTitle>
                                <DialogContent>
                                    <PostPreview
                                        id={input.value}
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
                    )
                }
            />
            <Dialog
                data-testid="dialog-add-post"
                fullWidth
                open={state.showCreateDialog}
                onClose={handleCloseCreate}
                aria-label={translate('simple.create-post')}
            >
                <DialogTitle>{translate('simple.create-post')}</DialogTitle>
                <DialogContent>
                    <PostQuickCreate
                        onCancel={handleCloseCreate}
                        onSave={handleSave}
                        basePath="/posts"
                        form="post-create"
                        resource="posts"
                    />
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default PostReferenceInput;
