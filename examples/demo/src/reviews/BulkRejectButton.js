import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThumbDown from '@material-ui/icons/ThumbDown';
import { Button, startUndoable, crudUpdateMany } from 'react-admin';

class BulkRejectButton extends Component {
    handleClick = () => {
        const { basePath, startUndoable, resource, selectedIds } = this.props;
        startUndoable(crudUpdateMany(resource, selectedIds, { status: 'rejected' }, basePath));
    };

    render() {
        return (
            <Button label="resources.reviews.action.reject" onClick={this.handleClick}>
                <ThumbDown />
            </Button>
        );
    }
}

BulkRejectButton.propTypes = {
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    startUndoable: PropTypes.func.isRequired,
};

export default connect(
    undefined,
    { startUndoable }
)(BulkRejectButton);
