import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import ActionDelete from '@material-ui/icons/Delete';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { crudDeleteMany, startUndoable, ComponentPropType } from 'ra-core';

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

const styles = theme =>
    createStyles({
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

class BulkDeleteWithUndoButton extends Component {
    static propTypes = {
        basePath: PropTypes.string,
        classes: PropTypes.object,
        label: PropTypes.string,
        resource: PropTypes.string.isRequired,
        startUndoable: PropTypes.func,
        selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
        icon: ComponentPropType,
    };

    static defaultProps = {
        label: 'ra.action.delete',
        undoable: true,
        icon: ActionDelete,
    };

    handleClick = () => {
        const {
            basePath,
            resource,
            selectedIds,
            startUndoable,
            onClick,
        } = this.props;

        startUndoable(crudDeleteMany(resource, selectedIds, basePath));

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    render() {
        const { classes, label, icon: Icon, onClick, ...rest } = this.props;
        return (
            <Button
                onClick={this.handleClick}
                label={label}
                className={classes.deleteButton}
                {...sanitizeRestProps(rest)}
            >
                <Icon />
            </Button>
        );
    }
}

const EnhancedBulkDeleteWithUndoButton = compose(
    connect(
        undefined,
        {
            startUndoable,
        }
    ),
    withStyles(styles)
)(BulkDeleteWithUndoButton);

export default EnhancedBulkDeleteWithUndoButton;
