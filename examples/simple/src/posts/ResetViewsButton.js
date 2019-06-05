import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { startUndoable, crudUpdateMany, Button } from 'react-admin';

class ResetViewsAction extends Component {
    handleClick = () => {
        const { basePath, startUndoable, resource, selectedIds } = this.props;
        startUndoable(crudUpdateMany(resource, selectedIds, { views: 0 }, basePath));
    };

    render() {
        return (
            <Button label="simple.action.resetViews" onClick={this.handleClick}>
                <VisibilityOff />
            </Button>
        );
    }
}

ResetViewsAction.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    startUndoable: PropTypes.func.isRequired,
};

export default connect(
    undefined,
    { startUndoable }
)(ResetViewsAction);
