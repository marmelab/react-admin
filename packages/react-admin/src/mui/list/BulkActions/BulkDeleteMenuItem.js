import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { MenuItem } from 'material-ui/Menu';

import { crudDeleteMany as crudDeleteManyAction } from '../../../actions';

import translate from '../../../i18n/translate';

const sanitizeRestProps = ({
    basePath,
    crudDeleteMany,
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
            crudDeleteMany,
            onClick,
            resource,
            selectedIds,
        } = this.props;

        onClick(true);
        crudDeleteMany(resource, selectedIds, basePath);
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
    crudDeleteMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
};

BulkDeleteMenuItem.defaultProps = {
    label: 'ra.action.delete',
};

const EnhancedBulkDeleteMenuItem = compose(
    connect(undefined, { crudDeleteMany: crudDeleteManyAction }),
    translate
)(BulkDeleteMenuItem);

export default EnhancedBulkDeleteMenuItem;
