import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Confirm } from 'react-admin';
import { crudUpdateMany } from 'ra-core';

class ResetViewsAction extends Component {
    handleDialogClose = () => {
        this.props.onExit();
    };

    handleConfirm = () => {
        const { basePath, crudUpdateMany, resource, selectedIds } = this.props;
        crudUpdateMany(resource, selectedIds, { views: 0 }, basePath);
        this.props.onExit();
    };

    render() {
        return (
            <Confirm
                isOpen={true}
                title="Update View Count"
                content="Are you sure you want to reset the views for these items?"
                onConfirm={this.handleConfirm}
                onClose={this.handleDialogClose}
            />
        );
    }
}

ResetViewsAction.propTypes = {
    basePath: PropTypes.string,
    crudUpdateMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default connect(undefined, { crudUpdateMany })(ResetViewsAction);
