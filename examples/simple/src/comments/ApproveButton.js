import React, { Component } from 'react';
import { connect } from 'react-redux';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { Button, startUndoable as startUndoableAction } from 'react-admin'; // eslint-disable-line import/no-unresolved
import { commentApprove } from './actions';
class ApproveButtonView extends Component {
    handleClick = () => {
        this.props.startUndoable(commentApprove(this.props.record));
    };

    render() {
        return (
            <Button
                data-testid="approve-button"
                label="simple.action.approve"
                onClick={this.handleClick}
            >
                <CheckCircle />
            </Button>
        );
    }
}

export default connect(
    undefined,
    { startUndoable: startUndoableAction }
)(ApproveButtonView);
