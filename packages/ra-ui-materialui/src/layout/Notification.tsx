import * as React from 'react';
import { styled, Theme } from '@mui/material/styles';
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

export const Notification = (
    props: NotificationProps & Omit<SnackbarProps, 'open'>
) => {
    const {
        classes: classesOverride,
        type = 'info',
        autoHideDuration = 4000,
        className,
        multiLine,
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
                    NotificationClasses[
                        (notification && notification.type) || type
                    ],
                    className,
                    { [NotificationClasses.multiline]: multiLine }
                ),
            }}
            action={
                notification && notification.undoable ? (
                    <StyledButton
                        color="primary"
                        className={NotificationClasses.undo}
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
    autoHideDuration: PropTypes.number,
    multiLine: PropTypes.bool,
};

const PREFIX = 'RaNotification';

export const NotificationClasses = {
    success: `${PREFIX}-success`,
    error: `${PREFIX}-error`,
    warning: `${PREFIX}-warning`,
    undo: `${PREFIX}-undo`,
    multiline: `${PREFIX}-multiline`,
};

const StyledButton = styled(Button, { name: PREFIX })(
    ({ theme, type }: NotificationProps & { theme?: Theme }) => ({
        [`& .${NotificationClasses.success}`]: {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
        },

        [`& .${NotificationClasses.error}`]: {
            backgroundColor: theme.palette.error.dark,
            color: theme.palette.error.contrastText,
        },

        [`& .${NotificationClasses.warning}`]: {
            backgroundColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
        },

        [`& .${NotificationClasses.undo}`]: {
            color:
                type === 'success'
                    ? theme.palette.success.contrastText
                    : theme.palette.primary.light,
        },
        [`& .${NotificationClasses.multiline}`]: {
            whiteSpace: 'pre-wrap',
        },
    })
);

export interface NotificationProps {
    type?: string;
    autoHideDuration?: number;
    multiLine?: boolean;
}
