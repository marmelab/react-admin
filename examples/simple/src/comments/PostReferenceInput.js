import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import { ReferenceInput, SelectInput } from 'react-admin'; // eslint-disable-line import/no-unresolved

import PostQuickCreate from './PostQuickCreate';

export default class PostReferenceInput extends React.Component {
    state = { showDialog: false, post_id: '' };

    handleClick = event => {
        event.preventDefault();
        this.setState({ showDialog: true });
    };

    handleClose = () => {
        this.setState({ showDialog: false });
    };

    handleSave = post => {
        console.log({ post });
        this.setState({ showDialog: false, post_id: post.id });
    };

    render() {
        const { showDialog, post_id } = this.state;

        return (
            <div>
                <ReferenceInput {...this.props} defaultValue={post_id}>
                    <SelectInput optionText="title" />
                </ReferenceInput>
                <Button onClick={this.handleClick}>New</Button>
                <Dialog
                    open={showDialog}
                    onClose={this.handleClose}
                    aria-label="New post"
                >
                    <DialogContent>
                        <PostQuickCreate
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
