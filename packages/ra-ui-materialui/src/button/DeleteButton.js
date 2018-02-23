import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { withStyles } from 'material-ui/styles';
import { fade } from 'material-ui/styles/colorManipulator';
import ActionDelete from 'material-ui-icons/Delete';
import classnames from 'classnames';
import inflection from 'inflection';
import {
    translate,
    crudDelete as crudDeleteAction,
    startCancellable,
} from 'ra-core';

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
        if (this.props.cancellable) {
            this.props.startCancellable(
                crudDeleteAction(
                    this.props.resource,
                    this.props.record.id,
                    this.props.record,
                    this.props.basePath,
                    this.props.redirect
                )
            );
        } else {
            this.props.crudDelete(
                this.props.resource,
                this.props.record.id,
                this.props.record,
                this.props.basePath,
                this.props.redirect
            );
        }
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
    cancellable: PropTypes.bool.isRequired,
    classes: PropTypes.object,
    className: PropTypes.string,
    crudDelete: PropTypes.func,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.string,
    resource: PropTypes.string.isRequired,
    startCancellable: PropTypes.func,
    translate: PropTypes.func,
};

DeleteButton.defaultProps = {
    cancellable: true,
    redirect: 'list',
};

export default compose(
    connect(null, { crudDelete: crudDeleteAction, startCancellable }),
    translate,
    withStyles(styles)
)(DeleteButton);
