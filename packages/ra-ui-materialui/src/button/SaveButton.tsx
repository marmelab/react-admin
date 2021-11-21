import React, { cloneElement, ReactElement, SyntheticEvent } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ContentSave from '@mui/icons-material/Save';
import classnames from 'classnames';
import {
    HandleSubmitWithRedirect,
    MutationMode,
    OnSuccess,
    OnFailure,
    Record,
    RedirectionSideEffect,
    TransformData,
    useFormContext,
    useNotify,
    useSaveContext,
    useTranslate,
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
 * @param {Props} props
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
export const SaveButton = (props: SaveButtonProps) => {
    const {
        className,
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

    const notify = useNotify();
    const translate = useTranslate();
    const formContext = useFormContext();
    const { setOnSuccess, setOnFailure, setTransform } = useSaveContext(props);

    const handleClick = event => {
        // deprecated: use onSuccess and transform instead of onSave
        if (typeof onSave === 'function') {
            if (process.env.NODE_ENV !== 'production') {
                console.warn(
                    '<SaveButton onSave> prop is deprecated, use the onSuccess prop instead.'
                );
                if (!formContext || !formContext.setOnSave) {
                    console.warn(
                        'Using <SaveButton> outside a FormContext is deprecated.'
                    );
                }
            }
            if (formContext && formContext.setOnSave) {
                formContext.setOnSave(onSave);
            }
        } else {
            if (
                process.env.NODE_ENV !== 'production' &&
                (!formContext || !formContext.setOnSave)
            ) {
                console.warn(
                    'Using <SaveButton> outside a FormContext is deprecated.'
                );
            }

            if (formContext && formContext.setOnSave) {
                // we reset to the Form default save function
                formContext.setOnSave();
            }
        }
        if (onSuccess) {
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
                notify('ra.message.invalid_form', { type: 'warning' });
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
        <StyledButton
            className={classnames(SaveButtonClasses.button, className)}
            variant={variant}
            type={type}
            onClick={handleClick}
            // TODO: find a way to display the loading state (LoadingButton from mui Lab?)
            // This is because the "default" color does not exist anymore
            color="primary"
            aria-label={displayedLabel}
            disabled={disabled}
            {...sanitizeButtonRestProps(rest)}
        >
            {saving ? (
                <CircularProgress
                    size={18}
                    thickness={2}
                    className={SaveButtonClasses.leftIcon}
                />
            ) : (
                cloneElement(icon, {
                    className: classnames(
                        SaveButtonClasses.leftIcon,
                        SaveButtonClasses.icon
                    ),
                })
            )}
            {displayedLabel}
        </StyledButton>
    );
};

const defaultIcon = <ContentSave />;

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
    mutationMode?: MutationMode;
}

export type SaveButtonProps = Props & ButtonProps;

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

const PREFIX = 'RaSaveButton';

export const SaveButtonClasses = {
    button: `${PREFIX}-button`,
    leftIcon: `${PREFIX}-leftIcon`,
    icon: `${PREFIX}-icon`,
};

const StyledButton = styled(Button, { name: PREFIX })(({ theme }) => ({
    [`&.${SaveButtonClasses.button}`]: {
        position: 'relative',
    },

    [`& .${SaveButtonClasses.leftIcon}`]: {
        marginRight: theme.spacing(1),
    },

    [`& .${SaveButtonClasses.icon}`]: {
        fontSize: 18,
    },
}));
