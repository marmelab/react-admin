import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Field } from 'redux-form';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import {
    crudGetMatching,
    ReferenceInput,
    SelectInput,
    translate,
} from 'react-admin'; // eslint-disable-line import/no-unresolved

import PostQuickCreate from './PostQuickCreate';
import PostPreview from './PostPreview';

const styles = {
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
};

class PostReferenceInputView extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        crudGetMatching: PropTypes.func.isRequired,
        post_id: PropTypes.any,
        translate: PropTypes.func.isRequired,
    };

    state = {
        showCreateDialog: false,
        showPreviewDialog: false,
        new_post_id: '',
    };

    handleNewClick = event => {
        event.preventDefault();
        this.setState({ showCreateDialog: true });
    };

    handleShowClick = event => {
        event.preventDefault();
        this.setState({ showPreviewDialog: true });
    };

    handleCloseCreate = () => {
        this.setState({ showCreateDialog: false });
    };

    handleCloseShow = () => {
        this.setState({ showPreviewDialog: false });
    };

    handleSave = post => {
        const { crudGetMatching } = this.props;
        this.setState({ showCreateDialog: false, new_post_id: post.id }, () => {
            // Refresh the choices of the ReferenceInput to ensure our newly created post
            // always appear, even after selecting another post
            crudGetMatching(
                'posts',
                'comments@post_id',
                { page: 1, perPage: 25 },
                { field: 'id', order: 'DESC' },
                {}
            );
        });
    };

    render() {
        const { showCreateDialog, showPreviewDialog, new_post_id } = this.state;
        const { classes, translate, ...props } = this.props;

        return (
            <Fragment>
                <ReferenceInput {...props} defaultValue={new_post_id}>
                    <SelectInput optionText="title" />
                </ReferenceInput>
                <Button
                    data-testid="button-add-post"
                    className={classes.button}
                    onClick={this.handleNewClick}
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
                                    onClick={this.handleShowClick}
                                >
                                    {translate('ra.action.show')}
                                </Button>
                                <Dialog
                                    data-testid="dialog-show-post"
                                    fullWidth
                                    open={showPreviewDialog}
                                    onClose={this.handleCloseShow}
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
                                            onClick={this.handleCloseShow}
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
                    open={showCreateDialog}
                    onClose={this.handleCloseCreate}
                    aria-label={translate('simple.create-post')}
                >
                    <DialogTitle>{translate('simple.create-post')}</DialogTitle>
                    <DialogContent>
                        <PostQuickCreate
                            onCancel={this.handleCloseCreate}
                            onSave={this.handleSave}
                            basePath="/posts"
                            form="post-create"
                            resource="posts"
                        />
                    </DialogContent>
                </Dialog>
            </Fragment>
        );
    }
}

const mapDispatchToProps = {
    crudGetMatching,
};

export default compose(
    connect(
        undefined,
        mapDispatchToProps
    ),
    withStyles(styles),
    translate
)(PostReferenceInputView);
