import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import { crudDeleteMany as crudDeleteManyAction, translate } from 'ra-core';

import Confirm from '../layout/Confirm';

class BulkDeleteAction extends Component {
    handleDialogClose = () => {
        this.props.onExit();
    };

    handleDelete = () => {
        const { basePath, crudDeleteMany, resource, selectedIds } = this.props;
        crudDeleteMany(resource, selectedIds, basePath);
        this.props.onExit();
    };

    render() {
        const { resource, selectedIds, translate } = this.props;
        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        return (
            <Confirm
                isOpen={true}
                title={translate('ra.message.bulk_delete_title', {
                    name: resourceName,
                    smart_count: selectedIds.length,
                })}
                content={translate('ra.message.bulk_delete_content', {
                    name: resourceName,
                    ids: selectedIds,
                    smart_count: selectedIds.length,
                })}
                confirm={translate('ra.action.delete')}
                confirmColor="warning"
                cancel={translate('ra.action.cancel')}
                onConfirm={this.handleDelete}
                onClose={this.handleDialogClose}
            />
        );
    }
}

BulkDeleteAction.propTypes = {
    basePath: PropTypes.string,
    crudDeleteMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
};

const EnhancedBulkDeleteAction = compose(
    connect(undefined, { crudDeleteMany: crudDeleteManyAction }),
    translate
)(BulkDeleteAction);

EnhancedBulkDeleteAction.defaultProps = {
    label: 'ra.action.delete',
};

export default EnhancedBulkDeleteAction;
