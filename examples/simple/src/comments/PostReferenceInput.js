import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { formValueSelector } from 'redux-form';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { ReferenceInput, SelectInput, translate } from 'react-admin'; // eslint-disable-line import/no-unresolved

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
        this.setState({ showCreateDialog: false, new_post_id: post.id });
    };

    render() {
        const { showCreateDialog, showPreviewDialog, new_post_id } = this.state;
        const { classes, translate, post_id, ...props } = this.props;

        return (
            <Fragment>
                <ReferenceInput {...props} defaultValue={new_post_id}>
                    <SelectInput optionText="title" />
                </ReferenceInput>
                <Button
                    className={classes.button}
                    onClick={this.handleNewClick}
                >
                    New
                </Button>
                {post_id && (
                    <Button
                        className={classes.button}
                        onClick={this.handleShowClick}
                    >
                        Show
                    </Button>
                )}
                <Dialog
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
                            formName="post-create"
                            resource="posts"
                        />
                    </DialogContent>
                </Dialog>
                <Dialog
                    fullWidth
                    open={showPreviewDialog}
                    onClose={this.handleCloseShow}
                    aria-label={translate('simple.create-post')}
                >
                    <DialogTitle>{translate('simple.create-post')}</DialogTitle>
                    <DialogContent>
                        <PostPreview
                            id={post_id}
                            basePath="/posts"
                            resource="posts"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseShow}>
                            {translate('simple.action.close')}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

const formSelector = formValueSelector('record-form');

const mapStateToProps = state => ({
    post_id: formSelector(state, 'post_id'),
});

export default compose(connect(mapStateToProps), withStyles(styles), translate)(
    PostReferenceInputView
);
