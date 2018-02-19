import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { MenuItem } from 'material-ui/Menu';
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
import inflection from 'inflection';
import { crudDeleteMany as crudDeleteManyAction, translate } from 'ra-core';

const sanitizeRestProps = ({
    basePath,
    crudDeleteMany,
    filterValues,
    onCloseMenu,
    resource,
    selectedIds,
    ...props
}) => props;

const styles = theme => ({
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

class BulkDeleteMenuItem extends Component {
    state = { dialogOpen: false };

    handleClick = () => {
        // FIXME needs portals to avoid that closing menu also closes the dialog
        // this.props.onCloseMenu();
        this.setState({ dialogOpen: true });
    };

    handleDialogClose = () => {
        this.setState({ dialogOpen: false });
    };

    handleDelete = event => {
        event.preventDefault();
        const { basePath, crudDeleteMany, resource, selectedIds } = this.props;
        crudDeleteMany(resource, selectedIds, basePath);
        this.setState({ dialogOpen: false });
    };

    render() {
        const {
            classes,
            label,
            resource,
            selectedIds,
            translate,
            ...rest
        } = this.props;
        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        return [
            <MenuItem
                key="menu"
                onClick={this.handleClick}
                {...sanitizeRestProps(rest)}
            >
                {translate(label)}
            </MenuItem>,
            <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleDialogClose}
                aria-labelledby="alert-dialog-title"
                key="dialog"
            >
                <DialogTitle id="alert-dialog-title">
                    {translate('ra.message.bulk_delete_title', {
                        name: resourceName,
                        smart_count: selectedIds.length,
                    })}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {translate('ra.message.bulk_delete_content', {
                            name: resourceName,
                            ids: selectedIds,
                            smart_count: selectedIds.length,
                        })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.handleDelete}
                        className={classes.buttonConfirm}
                        autoFocus
                    >
                        <ActionCheck className={classes.iconPaddingStyle} />
                        {translate('ra.action.delete')}
                    </Button>
                    <Button onClick={this.handleDialogClose}>
                        <AlertError className={classes.iconPaddingStyle} />
                        {translate('ra.action.cancel')}
                    </Button>
                </DialogActions>
            </Dialog>,
        ];
    }
}

BulkDeleteMenuItem.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    crudDeleteMany: PropTypes.func.isRequired,
    label: PropTypes.string,
    onCloseMenu: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
    selectedIds: PropTypes.arrayOf(PropTypes.any).isRequired,
    translate: PropTypes.func.isRequired,
};

BulkDeleteMenuItem.defaultProps = {
    label: 'ra.action.delete',
};

const EnhancedBulkDeleteMenuItem = compose(
    connect(undefined, { crudDeleteMany: crudDeleteManyAction }),
    translate,
    withStyles(styles)
)(BulkDeleteMenuItem);

export default EnhancedBulkDeleteMenuItem;
