import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import { ReferenceInput, SelectInput, translate } from 'react-admin'; // eslint-disable-line import/no-unresolved

import PostQuickCreate from './PostQuickCreate';

const styles = {
    button: {
        margin: '10px 24px',
        position: 'relative',
    },
};

class PostReferenceInputView extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        translate: PropTypes.func.isRequired,
    };

    state = { showDialog: false, post_id: '' };

    handleClick = event => {
        event.preventDefault();
        this.setState({ showDialog: true });
    };

    handleClose = () => {
        this.setState({ showDialog: false });
    };

    handleSave = post => {
        this.setState({ showDialog: false, post_id: post.id });
    };

    render() {
        const { showDialog, post_id } = this.state;
        const { classes, translate, ...props } = this.props;

        return (
            <div>
                <ReferenceInput {...props} defaultValue={post_id}>
                    <SelectInput optionText="title" />
                </ReferenceInput>
                <Button className={classes.button} onClick={this.handleClick}>
                    New
                </Button>
                <Dialog
                    open={showDialog}
                    onClose={this.handleClose}
                    aria-label={translate('simple.create-post')}
                >
                    <DialogTitle>{translate('simple.create-post')}</DialogTitle>
                    <DialogContent>
                        <PostQuickCreate
                            onCancel={this.handleClose}
                            onSave={this.handleSave}
                            basePath="/posts"
                            formName="post-create"
                            resource="posts"
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default compose(withStyles(styles), translate)(PostReferenceInputView);
