import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionCheck from '@material-ui/icons/CheckCircle';
import AlertError from '@material-ui/icons/ErrorOutline';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles(
    theme => ({
        contentText: {
            minWidth: 400,
        },
        confirmPrimary: {
            color: theme.palette.primary.main,
        },
        confirmWarning: {
            color: theme.palette.error.main,
            '&:hover': {
                backgroundColor: fade(theme.palette.error.main, 0.12),
                // Reset on mouse devices
                '@media (hover: none)': {
                    backgroundColor: 'transparent',
                },
            },
        },
        iconPaddingStyle: {
            paddingRight: '0.5em',
        },
    }),
    { name: 'RaConfirm' }
);

/**
 * Confirmation dialog
 *
 * @example
 * <Confirm
 *     isOpen={true}
 *     title="Delete Item"
 *     content="Are you sure you want to delete this item?"
 *     confirm="Yes"
 *     confirmColor="primary"
 *     ConfirmIcon=ActionCheck
 *     CancelIcon=AlertError
 *     cancel="Cancel"
 *     onConfirm={() => { // do something }}
 *     onClose={() => { // do something }}
 * />
 */
const Confirm = ({
    isOpen,
    loading,
    title,
    content,
    confirm,
    cancel,
    confirmColor,
    ConfirmIcon,
    CancelIcon,
    onClose,
    onConfirm,
    classes: classesOverride,
    translateOptions = {},
}) => {
    const classes = useStyles({ classes: classesOverride });
    const translate = useTranslate();

    const handleConfirm = useCallback(
        e => {
            e.stopPropagation();
            onConfirm();
        },
        [onConfirm]
    );

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            onClick={handleClick}
            aria-labelledby="alert-dialog-title"
        >
            <DialogTitle id="alert-dialog-title">
                {translate(title, { _: title, ...translateOptions })}
            </DialogTitle>
            <DialogContent>
                <DialogContentText className={classes.contentText}>
                    {translate(content, {
                        _: content,
                        ...translateOptions,
                    })}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={loading} onClick={onClose}>
                    <CancelIcon className={classes.iconPaddingStyle} />
                    {translate(cancel, { _: cancel })}
                </Button>
                <Button
                    disabled={loading}
                    onClick={handleConfirm}
                    className={classnames('ra-confirm', {
                        [classes.confirmWarning]: confirmColor === 'warning',
                        [classes.confirmPrimary]: confirmColor === 'primary',
                    })}
                    autoFocus
                >
                    <ConfirmIcon className={classes.iconPaddingStyle} />
                    {translate(confirm, { _: confirm })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

Confirm.propTypes = {
    cancel: PropTypes.string.isRequired,
    classes: PropTypes.object,
    confirm: PropTypes.string.isRequired,
    confirmColor: PropTypes.string.isRequired,
    ConfirmIcon: PropTypes.elementType.isRequired,
    CancelIcon: PropTypes.elementType.isRequired,
    content: PropTypes.string.isRequired,
    isOpen: PropTypes.bool,
    loading: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
};

Confirm.defaultProps = {
    cancel: 'ra.action.cancel',
    classes: {},
    confirm: 'ra.action.confirm',
    confirmColor: 'primary',
    ConfirmIcon: ActionCheck,
    CancelIcon: AlertError,
    isOpen: false,
};

export default Confirm;
