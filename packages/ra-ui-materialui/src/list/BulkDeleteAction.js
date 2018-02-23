import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { crudDeleteMany, startCancellable, translate } from 'ra-core';

class BulkDeleteAction extends Component {
    componentDidMount = () => {
        const {
            basePath,
            resource,
            selectedIds,
            startCancellable,
        } = this.props;
        startCancellable(crudDeleteMany(resource, selectedIds, basePath));
        this.props.onExit();
    };

    render() {
        return null;
    }
}

BulkDeleteAction.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    startCancellable: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
};

const EnhancedBulkDeleteAction = compose(
    connect(undefined, {
        startCancellable,
    }),
    translate
)(BulkDeleteAction);

EnhancedBulkDeleteAction.defaultProps = {
    label: 'ra.action.delete',
};

export default EnhancedBulkDeleteAction;
