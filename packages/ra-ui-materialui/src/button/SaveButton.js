import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ContentSave from '@material-ui/icons/Save';
import classnames from 'classnames';
import { showNotification, translate } from 'ra-core';

const styles = ({ spacing }) =>
    createStyles({
        button: {
            position: 'relative',
        },
        icon: {
            height: 20,
            width: 20,
            marginRight: spacing.unit,
        },
    });

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

export class SaveButton extends Component {
    static propTypes = {
        className: PropTypes.string,
        classes: PropTypes.object,
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
        variant: PropTypes.oneOf(['raised', 'flat', 'fab']),
        icon: PropTypes.element,
    };

    static defaultProps = {
        handleSubmitWithRedirect: () => () => {},
        icon: <ContentSave />,
    };

    handleClick = e => {
        const {
            handleSubmitWithRedirect,
            invalid,
            redirect,
            saving,
            showNotification,
            onClick,
        } = this.props;

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
            handleSubmitWithRedirect(redirect)();
        }

        if (typeof onClick === 'function') {
            onClick();
        }
    };

    render() {
        const {
            className,
            classes = {},
            invalid,
            label = 'ra.action.save',
            pristine,
            redirect,
            saving,
            submitOnEnter,
            translate,
            variant = 'raised',
            icon,
            onClick,
            ...rest
        } = this.props;

        const type = submitOnEnter ? 'submit' : 'button';
        return (
            <Button
                className={classnames(classes.button, className)}
                variant={variant}
                type={type}
                onClick={this.handleClick}
                color={saving ? 'default' : 'primary'}
                {...sanitizeRestProps(rest)}
            >
                {saving && saving.redirect === redirect ? (
                    <CircularProgress
                        size={18}
                        thickness={2}
                        className={classes.icon}
                    />
                ) : (
                    React.cloneElement(icon, {
                        className: classes.icon,
                    })
                )}
                {label && translate(label, { _: label })}
            </Button>
        );
    }
}

const enhance = compose(
    translate,
    connect(
        undefined,
        { showNotification }
    ),
    withStyles(styles)
);

export default enhance(SaveButton);
