import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import MuiButton from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { fade } from 'material-ui/styles/colorManipulator';
import ActionDelete from 'material-ui-icons/Delete';
import ActionCheck from 'material-ui-icons/CheckCircle';
import AlertError from 'material-ui-icons/ErrorOutline';
import classnames from 'classnames';
import inflection from 'inflection';
import { translate, crudDelete } from 'ra-core';

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
    buttonConfirm: {
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: theme.palette.error.main,
            },
        },
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
});

class DeleteButton extends Component {
    state = { dialogOpen: false };

    handleClick = () => {
        this.setState({ dialogOpen: true });
    };

    handleDialogClose = () => {
        this.setState({ dialogOpen: false });
    };

    handleDelete = event => {
        event.preventDefault();
        this.props.crudDelete(
            this.props.resource,
            this.props.record.id,
            this.props.record,
            this.props.basePath,
            this.props.redirect
        );
        this.setState({ dialogOpen: false });
    };

    render() {
        const {
            label = 'ra.action.delete',
            classes = {},
            className,
            record,
            resource,
            translate,
        } = this.props;
        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        return [
            <Button
                onClick={this.handleClick}
                label={label}
                className={classnames(
                    'ra-delete-button',
                    classes.deleteButton,
                    className
                )}
                key="button"
            >
                <ActionDelete />
            </Button>,
            <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleDialogClose}
                aria-labelledby="alert-dialog-title"
                key="dialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {translate('ra.message.delete_title', {
                        name: resourceName,
                        id: record && record.id,
                        data: record,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translate('ra.message.delete_content', {
                            name: resourceName,
                            id: record && record.id,
                            data: record,
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={this.handleDelete}
                        className={classnames(
                            'ra-confirm',
                            classes.buttonConfirm
                        )}
                        autoFocus
                    >
                        <ActionCheck className={classes.iconPaddingStyle} />
                        {translate('ra.action.delete')}
                    </MuiButton>
                    <MuiButton onClick={this.handleDialogClose}>
                        <AlertError className={classes.iconPaddingStyle} />
                        {translate('ra.action.cancel')}
                    </MuiButton>
                </DialogActions>
            </Dialog>,
        ];
    }
}

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    crudDelete: PropTypes.func,
    label: PropTypes.string,
    record: PropTypes.object,
    redirect: PropTypes.string,
    resource: PropTypes.string.isRequired,
    translate: PropTypes.func,
};

DeleteButton.defaultProps = {
    redirect: 'list',
};

export default compose(
    connect(null, { crudDelete }),
    translate,
    withStyles(styles)
)(DeleteButton);
