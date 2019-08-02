import React, { cloneElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import ContentSave from '@material-ui/icons/Save';
import classnames from 'classnames';
import { showNotification, translate } from 'ra-core';

const useStyles = makeStyles(theme => ({
    button: {
        position: 'relative',
    },
    leftIcon: {
        marginRight: theme.spacing(1),
    },
    icon: {
        fontSize: 18,
    },
}));

const sanitizeRestProps = ({
    basePath,
    className,
    classes,
    saving,
    label,
    invalid,
    variant,
    translate,
    handleSubmit,
    handleSubmitWithRedirect,
    submitOnEnter,
    record,
    redirect,
    resource,
    locale,
    showNotification,
    undoable,
    ...rest
}) => rest;

const SaveButton = ({
    className,
    invalid,
    label = 'ra.action.save',
    pristine,
    redirect,
    saving,
    submitOnEnter,
    translate,
    variant = 'contained',
    icon,
    onClick,
    handleSubmitWithRedirect,
    showNotification,
    ...rest
}) => {
    const classes = useStyles();
    const type = submitOnEnter ? 'submit' : 'button';

    const handleClick = e => {
        if (saving) {
            // prevent double submission
            e.preventDefault();
        } else {
            if (invalid) {
                showNotification('ra.message.invalid_form', 'warning');
            }
            // always submit form explicitly regardless of button type
            if (e) {
                e.preventDefault();
            }
            handleSubmitWithRedirect(redirect);
        }

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    return (
        <Button
            className={classnames(classes.button, className)}
            variant={variant}
            type={type}
            onClick={handleClick}
            color={saving ? 'default' : 'primary'}
            {...sanitizeRestProps(rest)}
        >
            {saving && saving.redirect === redirect ? (
                <CircularProgress
                    size={18}
                    thickness={2}
                    className={classes.leftIcon}
                />
            ) : (
                cloneElement(icon, {
                    className: classnames(classes.leftIcon, classes.icon),
                })
            )}
            {label && translate(label, { _: label })}
        </Button>
    );
};

SaveButton.propTypes = {
    className: PropTypes.string,
    handleSubmitWithRedirect: PropTypes.func,
    invalid: PropTypes.bool,
    label: PropTypes.string,
    pristine: PropTypes.bool,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    saving: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
    showNotification: PropTypes.func,
    submitOnEnter: PropTypes.bool,
    translate: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['text', 'raised', 'flat', 'fab']),
    icon: PropTypes.element,
};

SaveButton.defaultProps = {
    handleSubmitWithRedirect: () => () => {},
    icon: <ContentSave />,
};

const enhance = compose(
    translate,
    connect(
        undefined,
        { showNotification }
    )
);

export default enhance(SaveButton);
