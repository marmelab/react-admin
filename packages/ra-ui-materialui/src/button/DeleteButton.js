import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import { fade } from 'material-ui/styles/colorManipulator';
import ActionDelete from 'material-ui-icons/Delete';
import classnames from 'classnames';
import { translate, crudDelete, startCancellable } from 'ra-core';

import Confirm from '../layout/Confirm';
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

class DeleteButton extends Component {
    handleDelete = event => {
        event.preventDefault();
        const {
            startCancellable,
            resource,
            record,
            basePath,
            redirect,
        } = this.props;
        startCancellable(
            crudDelete(resource, record.id, record, basePath, redirect)
        );
    };

    render() {
        const {
            label = 'ra.action.delete',
            classes = {},
            className,
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
            >
                <ActionDelete />
            </Button>
        );
    }
}

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.string,
    resource: PropTypes.string.isRequired,
    startCancellable: PropTypes.func,
    translate: PropTypes.func,
};

DeleteButton.defaultProps = {
    redirect: 'list',
};

export default compose(
    connect(null, { startCancellable }),
    translate,
    withStyles(styles)
)(DeleteButton);
