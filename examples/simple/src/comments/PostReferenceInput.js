import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { ReferenceInput, SelectInput } from 'react-admin'; // eslint-disable-line import/no-unresolved

import PostQuickCreate from './PostQuickCreate';
import { hidePostQuickCreate, showPostQuickCreate } from './postQuickCreate';

class PostReferenceInputView extends React.Component {
    static propTypes = {
        hidePostQuickCreate: PropTypes.func.isRequired,
        showDialog: PropTypes.bool,
        showPostQuickCreate: PropTypes.func.isRequired,
    };

    handleClick = event => {
        event.preventDefault();
        this.props.showPostQuickCreate();
    };

    handleClose = () => {
        this.props.hidePostQuickCreate();
    };

    render() {
        const {
            showDialog,
            hidePostQuickCreate,
            showPostQuickCreate,
            ...props
        } = this.props;

        return (
            <div>
                <ReferenceInput {...props}>
                    <SelectInput optionText="title" />
                </ReferenceInput>
                <Button onClick={this.handleClick}>New</Button>
                <Dialog
                    open={showDialog}
                    onClose={this.handleClose}
                    aria-label="New post"
                >
                    <DialogContent>
                        <PostQuickCreate />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

const PostReferenceInput = connect(
    state => ({
        showDialog: state.postQuickCreate.showDialog,
    }),
    { hidePostQuickCreate, showPostQuickCreate }
)(PostReferenceInputView);

export default PostReferenceInput;
