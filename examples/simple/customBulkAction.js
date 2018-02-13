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
    onClick,
    resource,
    selectedIds,
    ...props
}) => props;
class BulkDeleteMenuItem extends Component {
    handleClick = () => {
        const {
            basePath,
            crudUpdateMany,
            onClick,
            resource,
            selectedIds,
        } = this.props;

        onClick(true);
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

BulkDeleteMenuItem.propTypes = {
    basePath: PropTypes.string,
    crudUpdateMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
};

BulkDeleteMenuItem.defaultProps = {
    label: 'simple.action.resetViews',
};

const EnhancedBulkDeleteMenuItem = compose(
    connect(undefined, { crudUpdateMany: crudUpdateManyAction }),
    translate
)(BulkDeleteMenuItem);

export default EnhancedBulkDeleteMenuItem;
