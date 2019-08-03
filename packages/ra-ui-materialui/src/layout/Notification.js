import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

import {
    hideNotification,
    getNotification,
    undo,
    complete,
    undoableEventEmitter,
    useTranslate,
} from 'ra-core';

const useStyles = makeStyles(theme => ({
    confirm: {
        backgroundColor: theme.palette.background.default,
    },
    warning: {
        backgroundColor: theme.palette.error.light,
    },
    undo: {
        color: theme.palette.primary.light,
    },
}));

const Notification = ({
    autoHideDuration,
    type,
    classes,
    className,
    ...rest
}) => {
    const [open, setOpen] = useState(false);
    const notification = useSelector(getNotification);
    const dispatch = useDispatch();
    const translate = useTranslate();
    const styles = useStyles();

    useEffect(() => {
        setOpen(!!notification);
    }, [notification]);

    const handleRequestClose = () => {
        setOpen(false);
    };

    const handleExited = () => {
        if (notification && notification.undoable) {
            dispatch(complete());
            undoableEventEmitter.emit('end', { isUndo: false });
        }
        dispatch(hideNotification());
    };

    const handleUndo = () => {
        dispatch(undo());
        undoableEventEmitter.emit('end', { isUndo: true });
    };

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
            onExited={handleExited}
            onClose={handleRequestClose}
            ContentProps={{
                className: classnames(
                    styles[(notification && notification.type) || type],
                    className
                ),
            }}
            action={
                notification && notification.undoable ? (
                    <Button
                        color="primary"
                        className={styles.undo}
                        size="small"
                        onClick={handleUndo}
                    >
                        {translate('ra.action.undo')}
                    </Button>
                ) : null
            }
            classes={classes}
            {...rest}
        />
    );
};

Notification.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    type: PropTypes.string,
    autoHideDuration: PropTypes.number,
};

Notification.defaultProps = {
    type: 'info',
    autoHideDuration: 4000,
};

export default Notification;
