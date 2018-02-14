import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { MenuItem } from 'material-ui/Menu';

import { translate, crudUpdateMany as crudUpdateManyAction } from 'react-admin';

const sanitizeRestProps = ({
    basePath,
    crudUpdateMany,
    filterValues,
    onCloseMenu,
    resource,
    selectedIds,
    ...props
}) => props;
class BulkUpdateMenuItem extends Component {
    handleClick = () => {
        const {
            basePath,
            crudUpdateMany,
            onCloseMenu,
            resource,
            selectedIds,
        } = this.props;

        onCloseMenu();
        crudUpdateMany(resource, selectedIds, { views: 0 }, basePath);
    };

    render() {
        const { label, translate, ...rest } = this.props;
        return (
            <MenuItem onClick={this.handleClick} {...sanitizeRestProps(rest)}>
                {translate(label)}
            </MenuItem>
        );
    }
}

BulkUpdateMenuItem.propTypes = {
    basePath: PropTypes.string,
    crudUpdateMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onCloseMenu: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
};

BulkUpdateMenuItem.defaultProps = {
    label: 'simple.action.resetViews',
};

const EnhancedBulkUpdateMenuItem = compose(
    connect(undefined, { crudUpdateMany: crudUpdateManyAction }),
    translate
)(BulkUpdateMenuItem);

export default EnhancedBulkUpdateMenuItem;
