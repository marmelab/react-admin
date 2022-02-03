import * as React from 'react';
import {
    cloneElement,
    MouseEventHandler,
    ReactElement,
    useCallback,
} from 'react';
import { UseMutationOptions } from 'react-query';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ContentSave from '@mui/icons-material/Save';
import classnames from 'classnames';
import { useFormContext } from 'react-hook-form';
import {
    CreateParams,
    MutationMode,
    RaRecord,
    TransformData,
    UpdateParams,
    useNotify,
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
 * @prop {function} mutationOptions Object of options passed to react-query.
 * @prop {function} transform Callback to execute before calling the dataProvider. Receives the data from the form, must return that transformed data. Can be asynchronous (and return a Promise)
 *
 * @param {Props} props
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
 *     return <SaveButton {...props} mutationOptions={{ onSuccess }} />;
 * }
 */
export const SaveButton = <RecordType extends RaRecord = any>(
    props: SaveButtonProps<RecordType>
) => {
    const {
        className,
        icon = defaultIcon,
        invalid,
        label = 'ra.action.save',
        onClick,
        mutationOptions,
        saving,
        disabled = saving,
        submitOnEnter,
        transform,
        variant = 'contained',
        ...rest
    } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const form = useFormContext();
    const saveContext = useSaveContext();
    const hasSideEffects = !!mutationOptions || !!transform;
    const type = !submitOnEnter || hasSideEffects ? 'button' : 'submit';

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async event => {
            if (onClick) {
                onClick(event);
            }
            if (event.defaultPrevented) {
                return;
            }
            if (type === 'button') {
                // this button doesn't submit the form, so it doesn't trigger useIsFormInvalid in <FormContent>
                // therefore we need to check for errors manually
                event.preventDefault();
                const isFormValid = await form.trigger();
                if (!isFormValid) {
                    event.preventDefault();
                    notify('ra.message.invalid_form', { type: 'warning' });
                    return;
                }
                const values = form.getValues();
                saveContext?.save(values, {
                    ...mutationOptions,
                    transform,
                });
            }
        },
        [form, notify, mutationOptions, saveContext, transform, onClick, type]
    );

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

interface Props<RecordType extends RaRecord = any> {
    className?: string;
    disabled?: boolean;
    icon?: ReactElement;
    invalid?: boolean;
    label?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        unknown,
        CreateParams<RecordType> | UpdateParams<RecordType>
    >;
    transform?: TransformData;
    saving?: boolean;
    submitOnEnter?: boolean;
    variant?: string;
    // May be injected by Toolbar - sanitized in Button
    record?: RaRecord;
    resource?: string;
    mutationMode?: MutationMode;
}

export type SaveButtonProps<RecordType extends RaRecord = any> = Props<
    RecordType
> &
    ButtonProps;

SaveButton.propTypes = {
    className: PropTypes.string,
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
