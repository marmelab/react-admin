import * as React from 'react';
import { cloneElement, MouseEventHandler, ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ContentSave from '@mui/icons-material/Save';
import classnames from 'classnames';
import { useForm } from 'react-final-form';
import {
    MutationMode,
    OnSuccess,
    OnFailure,
    Record,
    TransformData,
    useSaveContext,
    useTranslate,
} from 'ra-core';

import { sanitizeButtonRestProps } from './Button';

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
        icon = defaultIcon,
        invalid,
        label = 'ra.action.save',
        onClick,
        onFailure,
        onSuccess,
        saving,
        disabled = saving,
        submitOnEnter,
        transform,
        variant = 'contained',
        ...rest
    } = props;
    const translate = useTranslate();
    const form = useForm();
    const saveContext = useSaveContext();
    const hasSideEffects = !!onSuccess || !!onFailure || !!transform;
    const type = !submitOnEnter || hasSideEffects ? 'button' : 'submit';

    const handleClick: MouseEventHandler<HTMLButtonElement> = event => {
        if (onClick) {
            onClick(event);
        }
        if (event.defaultPrevented) {
            return;
        }

        if (hasSideEffects) {
            event.preventDefault();
            const values = form.getState().values;
            saveContext?.save(values, {
                onSuccess,
                onFailure,
                transform,
            });
        }
    };

    const displayedLabel = label && translate(label, { _: label });
    return (
        <StyledButton
            className={classnames(SaveButtonClasses.button, className)}
            variant={variant}
            type={type}
            color="primary"
            aria-label={displayedLabel}
            disabled={disabled}
            onClick={handleClick}
            // TODO: find a way to display the loading state (LoadingButton from mui Lab?)
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
    disabled?: boolean;
    icon?: ReactElement;
    invalid?: boolean;
    label?: string;
    onSuccess?: OnSuccess;
    onFailure?: OnFailure;
    transform?: TransformData;
    saving?: boolean;
    submitOnEnter?: boolean;
    variant?: string;
    // May be injected by Toolbar - sanitized in Button
    basePath?: string;
    record?: Record;
    resource?: string;
    mutationMode?: MutationMode;
}

export type SaveButtonProps = Props & ButtonProps;

SaveButton.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    invalid: PropTypes.bool,
    label: PropTypes.string,
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
