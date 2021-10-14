import * as React from 'react';
import { useCallback, MouseEventHandler } from 'react';
import PropTypes, { ReactComponentLike } from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import ActionCheck from '@material-ui/icons/CheckCircle';
import AlertError from '@material-ui/icons/ErrorOutline';
import classnames from 'classnames';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles(
    theme => ({
        confirmPrimary: {
            color: theme.palette.primary.main,
        },
        confirmWarning: {
            color: theme.palette.error.main,
            '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.12),
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
const Confirm = (props: ConfirmProps) => {
    const {
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
        translateOptions = {},
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();

    const handleConfirm = useCallback(
        e => {
            e.stopPropagation();
            onConfirm(e);
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
                {typeof content === 'string' ? (
                    <DialogContentText>
                        {translate(content, {
                            _: content,
                            ...translateOptions,
                        })}
                    </DialogContentText>
                ) : (
                    content
                )}
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

export interface ConfirmProps {
    cancel?: string;
    classes?: object;
    confirm?: string;
    confirmColor?: string;
    ConfirmIcon?: ReactComponentLike;
    CancelIcon?: ReactComponentLike;
    content: React.ReactNode;
    isOpen?: boolean;
    loading?: boolean;
    onClose: MouseEventHandler;
    onConfirm: MouseEventHandler;
    title: string;
    translateOptions?: object;
}

Confirm.propTypes = {
    cancel: PropTypes.string,
    classes: PropTypes.object,
    confirm: PropTypes.string,
    confirmColor: PropTypes.string,
    ConfirmIcon: PropTypes.elementType,
    CancelIcon: PropTypes.elementType,
    content: PropTypes.node.isRequired,
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
