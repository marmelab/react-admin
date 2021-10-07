import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Snackbar, SnackbarProps } from '@mui/material';
import classnames from 'classnames';

import {
    hideNotification,
    getNotification,
    undo,
    complete,
    undoableEventEmitter,
    useTranslate,
} from 'ra-core';

const PREFIX = 'RaNotification';

const classes = {
    success: `${PREFIX}-success`,
    error: `${PREFIX}-error`,
    warning: `${PREFIX}-warning`,
    undo: `${PREFIX}-undo`,
};

const StyledButton = styled(Button)(({ theme }) => ({
    [`& .${classes.success}`]: {
        backgroundColor: theme.palette.success.main,
        color: theme.palette.success.contrastText,
    },

    [`& .${classes.error}`]: {
        backgroundColor: theme.palette.error.dark,
        color: theme.palette.error.contrastText,
    },

    [`& .${classes.warning}`]: {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
    },

    [`& .${classes.undo}`]: (props: Props & Omit<SnackbarProps, 'open'>) => ({
        color:
            props.type === 'success'
                ? theme.palette.success.contrastText
                : theme.palette.primary.light,
    }),
}));

interface Props {
    type?: string;
}

const Notification = (props: Props & Omit<SnackbarProps, 'open'>) => {
    const {
        classes: classesOverride,
        type,
        className,
        autoHideDuration,
        ...rest
    } = props;
    const [open, setOpen] = useState(false);
    const notification = useSelector(getNotification);
    const dispatch = useDispatch();
    const translate = useTranslate();

    useEffect(() => {
        setOpen(!!notification);
    }, [notification]);

    const handleRequestClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleExited = useCallback(() => {
        if (notification && notification.undoable) {
            dispatch(complete());
            undoableEventEmitter.emit('end', { isUndo: false });
        }
        dispatch(hideNotification());
    }, [dispatch, notification]);

    const handleUndo = useCallback(() => {
        dispatch(undo());
        undoableEventEmitter.emit('end', { isUndo: true });
    }, [dispatch]);

    return (
        <Snackbar
            open={open}
            message={
                notification &&
                notification.message &&
                translate(notification.message, notification.messageArgs)
            }
            autoHideDuration={
                (notification && notification.autoHideDuration) ||
                autoHideDuration
            }
            disableWindowBlurListener={notification && notification.undoable}
            TransitionProps={{ onExited: handleExited }}
            onClose={handleRequestClose}
            ContentProps={{
                className: classnames(
                    classes[(notification && notification.type) || type],
                    className
                ),
            }}
            action={
                notification && notification.undoable ? (
                    <StyledButton
                        color="primary"
                        className={classes.undo}
                        size="small"
                        onClick={handleUndo}
                    >
                        <>{translate('ra.action.undo')}</>
                    </StyledButton>
                ) : null
            }
            {...rest}
        />
    );
};

Notification.propTypes = {
    type: PropTypes.string,
};

Notification.defaultProps = {
    type: 'info',
    autoHideDuration: 4000,
};

export default Notification;
