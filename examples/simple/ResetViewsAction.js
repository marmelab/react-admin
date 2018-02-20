import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import ActionCheck from 'material-ui-icons/CheckCircle';
import AlertError from 'material-ui-icons/ErrorOutline';
import { crudUpdateMany } from 'ra-core';

const styles = {
    icon: {
        paddingRight: '0.5em',
    },
};

class ResetViewsAction extends Component {
    handleDialogClose = () => {
        this.props.onExit();
    };

    handleConfirm = () => {
        const { basePath, crudUpdateMany, resource, selectedIds } = this.props;
        crudUpdateMany(resource, selectedIds, { views: 0 }, basePath);
        this.props.onExit();
    };

    render() {
        const { classes } = this.props;
        return (
            <Dialog
                open={true}
                onClose={this.handleDialogClose}
                aria-labelledby="alert-dialog-title"
            >
                <DialogTitle id="alert-dialog-title">
                    Update View Count
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to reset the views for these
                        items?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        color="primary"
                        onClick={this.handleConfirm}
                        className="ra-confirm"
                    >
                        <ActionCheck className={classes.icon} />
                        Confirm
                    </Button>
                    <Button onClick={this.handleDialogClose}>
                        <AlertError className={classes.icon} />
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

ResetViewsAction.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    crudUpdateMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onExit: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const EnhancedResetViewsAction = compose(
    connect(undefined, { crudUpdateMany }),
    withStyles(styles)
)(ResetViewsAction);

EnhancedResetViewsAction.defaultProps = {
    label: 'ra.action.delete',
};

export default EnhancedResetViewsAction;
