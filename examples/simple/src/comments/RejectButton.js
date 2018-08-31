import React, { Component } from 'react';
import { connect } from 'react-redux';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { Button, startUndoable as startUndoableAction } from 'react-admin'; // eslint-disable-line import/no-unresolved
import { commentReject } from './actions';
class RejectButtonView extends Component {
    handleClick = () => {
        this.props.startUndoable(commentReject(this.props.record));
    };

    render() {
        return (
            <Button
                data-testid="reject-button"
                label="simple.action.reject"
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
)(RejectButtonView);
