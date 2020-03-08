import React, {
    useContext,
    cloneElement,
    FC,
    ReactElement,
    SyntheticEvent,
} from 'react';
import PropTypes from 'prop-types';
import Button, { ButtonProps } from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import ContentSave from '@material-ui/icons/Save';
import classnames from 'classnames';
import {
    useTranslate,
    useNotify,
    RedirectionSideEffect,
    Record,
    FormContext,
} from 'ra-core';

const SaveButton: FC<SaveButtonProps> = props => {
    const {
        className,
        classes: classesOverride,
        invalid,
        label = 'ra.action.save',
        pristine,
        redirect,
        saving,
        submitOnEnter,
        variant = 'contained',
        icon = defaultIcon,
        onClick,
        handleSubmitWithRedirect,
        onSave,
        ...rest
    } = props;
    const classes = useStyles(props);
    const notify = useNotify();
    const translate = useTranslate();
    const { setOnSave } = useContext(FormContext);

    const handleClick = event => {
        if (typeof onSave === 'function') {
            setOnSave(onSave);
        } else {
            // we reset to the Form default save function
            setOnSave();
        }
        if (saving) {
            // prevent double submission
            event.preventDefault();
        } else {
            if (invalid) {
                notify('ra.message.invalid_form', 'warning');
            }
            // always submit form explicitly regardless of button type
            if (event) {
                event.preventDefault();
            }
            handleSubmitWithRedirect(redirect);
        }

        if (typeof onClick === 'function') {
            onClick(event);
        }
    };

    const type = submitOnEnter ? 'submit' : 'button';
    const displayedLabel = label && translate(label, { _: label });
    return (
        <Button
            className={classnames(classes.button, className)}
            variant={variant}
            type={type}
            onClick={handleClick}
            color={saving ? 'default' : 'primary'}
            aria-label={displayedLabel}
            {...sanitizeRestProps(rest)}
        >
            {saving ? (
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
            {displayedLabel}
        </Button>
    );
};

const defaultIcon = <ContentSave />;

const useStyles = makeStyles(
    theme => ({
        button: {
            position: 'relative',
        },
        leftIcon: {
            marginRight: theme.spacing(1),
        },
        icon: {
            fontSize: 18,
        },
    }),
    { name: 'RaSaveButton' }
);

const sanitizeRestProps = ({
    basePath,
    handleSubmit,
    record,
    resource,
    undoable,
    ...rest
}: SaveButtonProps) => rest;

interface Props {
    classes?: object;
    className?: string;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    onSave?: (values: object, redirect: RedirectionSideEffect) => void;
    icon?: ReactElement;
    invalid?: boolean;
    label?: string;
    onClick?: () => void;
    pristine?: boolean;
    redirect?: RedirectionSideEffect;
    saving?: boolean;
    submitOnEnter?: boolean;
    variant?: string;
    // May be injected by Toolbar - sanitized in SaveButton
    basePath?: string;
    handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
    record?: Record;
    resource?: string;
    undoable?: boolean;
}

type SaveButtonProps = Props & ButtonProps;

SaveButton.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    handleSubmitWithRedirect: PropTypes.func,
    onSave: PropTypes.func,
    invalid: PropTypes.bool,
    label: PropTypes.string,
    pristine: PropTypes.bool,
    redirect: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.func,
    ]),
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    icon: PropTypes.element,
};

export default SaveButton;
