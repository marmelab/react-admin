import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionDelete from '@material-ui/icons/Delete';
import classnames from 'classnames';
import { translate, crudDelete, startUndoable } from 'ra-core';

import Button from './Button';

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

const sanitizeRestProps = ({
    basePath,
    classes,
    dispatchCrudDelete,
    filterValues,
    label,
    resource,
    selectedIds,
    startUndoable,
    undoable,
    redirect,
    ...rest
}) => rest;

class DeleteButton extends Component {
    handleDelete = event => {
        event.stopPropagation();
        const {
            dispatchCrudDelete,
            startUndoable,
            resource,
            record,
            basePath,
            redirect,
            undoable,
            onClick,
        } = this.props;
        if (undoable) {
            startUndoable(
                crudDelete(resource, record.id, record, basePath, redirect)
            );
        } else {
            dispatchCrudDelete(resource, record.id, record, basePath, redirect);
        }

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    render() {
        const {
            label = 'ra.action.delete',
            classes = {},
            className,
            icon,
            onClick,
            ...rest
        } = this.props;
        return (
            <Button
                onClick={this.handleDelete}
                label={label}
                className={classnames(
                    'ra-delete-button',
                    classes.deleteButton,
                    className
                )}
                key="button"
                {...sanitizeRestProps(rest)}
            >
                {icon}
            </Button>
        );
    }
}

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    dispatchCrudDelete: PropTypes.func.isRequired,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    resource: PropTypes.string.isRequired,
    startUndoable: PropTypes.func,
    translate: PropTypes.func,
    undoable: PropTypes.bool,
    icon: PropTypes.element,
};

DeleteButton.defaultProps = {
    redirect: 'list',
    undoable: true,
    icon: <ActionDelete />,
};

export default compose(
    connect(
        null,
        { startUndoable, dispatchCrudDelete: crudDelete }
    ),
    translate,
    withStyles(styles)
)(DeleteButton);
