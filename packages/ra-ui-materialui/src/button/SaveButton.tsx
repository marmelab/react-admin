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
    OnSuccess,
    OnFailure,
    TransformData,
    Record,
    FormContext,
    HandleSubmitWithRedirect,
    useSaveContext,
} from 'ra-core';

import { sanitizeButtonRestProps } from './Button';
import { FormRenderProps } from 'react-final-form';

/**
 * Submit button for resource forms (Edit and Create).
 *
 * @typedef {Object} Props the props you can use (other props are injected by the <Toolbar>)
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.save', translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant Material-ui variant for the button. Defaults to 'contained'.
 * @prop {ReactElement} icon
 * @prop {string|boolean} redirect Override of the default redirect in case of success. Can be 'list', 'show', 'edit' (for create views), or false (to stay on the creation form).
 * @prop {function} onSave (deprecated)
 * @prop {function} onSuccess Callback to execute instead of the default success side effects. Receives the dataProvider response as argument.
 * @prop {function} onFailure Callback to execute instead of the default error side effects. Receives the dataProvider error response as argument.
 * @prop {function} transform Callback to execute before calling the dataProvider. Receives the data from the form, must return that transformed data. Can be asynchronous (and return a Promise)
 *
 * @param {Prop} props
 *
 * @example // with custom redirection
 *
 * <SaveButton label="post.action.save_and_edit" redirect="edit" />
 *
 * @example // with no redirection
 *
 * <SaveButton label="post.action.save_and_add" redirect={false} />
 *
 * @example // with custom success side effect
 *
 * const MySaveButton = props => {
 *     const notify = useNotify();
 *     const redirect = useRedirect();
 *     const onSuccess = (response) => {
 *         notify(`Post "${response.data.title}" saved!`);
 *         redirect('/posts');
 *     };
 *     return <SaveButton {...props} onSuccess={onSuccess} />;
 * }
 */
const SaveButton: FC<SaveButtonProps> = props => {
    const {
        className,
        classes: classesOverride,
        invalid,
        label = 'ra.action.save',
        disabled,
        redirect,
        saving,
        submitOnEnter,
        variant = 'contained',
        icon = defaultIcon,
        onClick,
        handleSubmitWithRedirect,
        onSave,
        onSuccess,
        onFailure,
        transform,
        ...rest
    } = props;
    const classes = useStyles(props);
    const notify = useNotify();
    const translate = useTranslate();
    const { setOnSave } = useContext(FormContext);
    const { setOnSuccess, setOnFailure, setTransform } = useSaveContext();

    const handleClick = event => {
        // deprecated: use onSuccess and transform instead of onSave
        if (typeof onSave === 'function') {
            if (process.env.NODE_ENV !== 'production') {
                console.log(
                    '<SaveButton onSave> prop is deprecated, use the onSuccess prop instead.'
                );
            }
            setOnSave(onSave);
        } else {
            // we reset to the Form default save function
            setOnSave();
        }
        if (onSuccess) {
            console.log('onSuccess');
            setOnSuccess(onSuccess);
        }
        if (onFailure) {
            setOnFailure(onFailure);
        }
        if (transform) {
            setTransform(transform);
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
            disabled={disabled}
            {...sanitizeButtonRestProps(rest)}
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

interface Props {
    classes?: object;
    className?: string;
    handleSubmitWithRedirect?:
        | HandleSubmitWithRedirect
        | FormRenderProps['handleSubmit'];
    // @deprecated
    onSave?: (values: object, redirect: RedirectionSideEffect) => void;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
    icon?: ReactElement;
    invalid?: boolean;
    label?: string;
    onClick?: () => void;
    disabled?: boolean;
    redirect?: RedirectionSideEffect;
    saving?: boolean;
    submitOnEnter?: boolean;
    variant?: string;
    // May be injected by Toolbar - sanitized in Button
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
    // @deprecated
    onSave: PropTypes.func,
    invalid: PropTypes.bool,
    label: PropTypes.string,
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
