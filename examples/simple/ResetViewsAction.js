import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { startCancellable, crudUpdateMany } from 'ra-core';

class ResetViewsAction extends Component {
    componentDidMount = () => {
        const {
            basePath,
            startCancellable,
            resource,
            selectedIds,
        } = this.props;
        startCancellable(
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
    startCancellable: PropTypes.func.isRequired,
};

export default connect(undefined, { startCancellable })(ResetViewsAction);
