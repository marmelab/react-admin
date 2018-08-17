import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import ActionDelete from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { crudDeleteMany, startUndoable } from 'ra-core';

import Button from './Button';

const sanitizeRestProps = ({
    basePath,
    classes,
    dispatchCrudDeleteMany,
    filterValues,
    label,
    resource,
    selectedIds,
    startUndoable,
    undoable,
    ...rest
}) => rest;

const styles = theme => ({
    deleteButton: {
        color: theme.palette.error.main,
        '&:hover': {
            backgroundColor: fade(theme.palette.error.main, 0.12),
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
});

class BulkDeleteButton extends Component {
    handleClick = () => {
        const {
            basePath,
            dispatchCrudDeleteMany,
            resource,
            selectedIds,
            startUndoable,
            undoable,
        } = this.props;
        if (undoable) {
            startUndoable(crudDeleteMany(resource, selectedIds, basePath));
        } else {
            dispatchCrudDeleteMany(resource, selectedIds, basePath);
        }
    };

    render() {
        const { classes, label, ...rest } = this.props;
        return (
            <Button
                onClick={this.handleClick}
                label={label}
                className={classes.deleteButton}
                {...sanitizeRestProps(rest)}
            >
                <ActionDelete />
            </Button>
        );
    }
}

BulkDeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    dispatchCrudDeleteMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    resource: PropTypes.string.isRequired,
    startUndoable: PropTypes.func,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    undoable: PropTypes.bool,
};

const EnhancedBulkDeleteButton = compose(
    connect(
        undefined,
        {
            startUndoable,
            dispatchCrudDeleteMany: crudDeleteMany,
        }
    ),
    withStyles(styles)
)(BulkDeleteButton);

EnhancedBulkDeleteButton.defaultProps = {
    label: 'ra.action.delete',
    undoable: true,
};

export default EnhancedBulkDeleteButton;
