import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ThumbUp from '@material-ui/icons/ThumbUp';
import { Button, startUndoable, crudUpdateMany } from 'react-admin';

class BulkAcceptButton extends Component {
    handleClick = () => {
        const { basePath, startUndoable, resource, selectedIds } = this.props;
        startUndoable(
            crudUpdateMany(
                resource,
                selectedIds,
                { status: 'accepted' },
                basePath
            )
        );
    };

    render() {
        return (
            <Button
                label="resources.reviews.action.accept"
                onClick={this.handleClick}
            >
                <ThumbUp />
            </Button>
        );
    }
}

BulkAcceptButton.propTypes = {
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    startUndoable: PropTypes.func.isRequired,
};

export default connect(
    undefined,
    { startUndoable }
)(BulkAcceptButton);
