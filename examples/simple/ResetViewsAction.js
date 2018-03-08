import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startUndoable, crudUpdateMany } from 'ra-core';

class ResetViewsAction extends Component {
    componentDidMount = () => {
        const { basePath, startUndoable, resource, selectedIds } = this.props;
        startUndoable(
            crudUpdateMany(resource, selectedIds, { views: 0 }, basePath)
        );
        this.props.onExit();
    };

    render() {
        return null;
    }
}

ResetViewsAction.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    startUndoable: PropTypes.func.isRequired,
};

export default connect(undefined, { startUndoable })(ResetViewsAction);
