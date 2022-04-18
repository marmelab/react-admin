import * as React from 'react';
import { MouseEventHandler, ReactElement, useCallback } from 'react';
import { UseMutationOptions } from 'react-query';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button, ButtonProps, CircularProgress } from '@mui/material';
import ContentSave from '@mui/icons-material/Save';
import { useFormContext, useFormState } from 'react-hook-form';
import {
    CreateParams,
    MutationMode,
    RaRecord,
    TransformData,
    UpdateParams,
    useNotify,
    useSaveContext,
    useTranslate,
    warning,
} from 'ra-core';

import { sanitizeButtonRestProps } from './Button';

/**
 * Submit button for resource forms (Edit and Create).
 *
 * @typedef {Object} Props the props you can use (other props are injected by the <Toolbar>)
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.save', translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant MUI variant for the button. Defaults to 'contained'.
 * @prop {ReactElement} icon
 * @prop {function} mutationOptions Object of options passed to react-query.
 * @prop {function} transform Callback to execute before calling the dataProvider. Receives the data from the form, must return that transformed data. Can be asynchronous (and return a Promise)
 * @prop {boolean} alwaysEnable Force enabling the <SaveButton>. If it's not defined, the `<SaveButton>` will be enabled using `react-hook-form`'s `isValidating` state props and form context's `saving` prop (disabled if isValidating or saving, enabled otherwise).
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
        color = 'primary',
        icon = defaultIcon,
        invalid,
        label = 'ra.action.save',
        onClick,
        mutationOptions,
        saving,
        disabled: disabledProp,
        type = 'submit',
        transform,
        variant = 'contained',
        alwaysEnable = false,
        ...rest
    } = props;
    const translate = useTranslate();
    const notify = useNotify();
    const form = useFormContext();
    const saveContext = useSaveContext();
    const { isDirty, isValidating } = useFormState();
    // Use form isDirty, isValidating and form context saving to enable or disable the save button
    // if alwaysEnable is undefined
    const disabled = valueOrDefault(
        alwaysEnable === false || alwaysEnable === undefined
            ? undefined
            : !alwaysEnable,
        disabledProp || !isDirty || isValidating || saveContext?.saving
    );

    warning(
        type === 'submit' &&
            ((mutationOptions &&
                (mutationOptions.onSuccess || mutationOptions.onError)) ||
                transform),
        'Cannot use <SaveButton mutationOptions> props on a button of type "submit". To override the default mutation options on a particular save button, set the <SaveButton type="button"> prop, or set mutationOptions in the main view component (<Create> or <Edit>).'
    );

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
    const finalSaving =
        typeof saving !== 'undefined' ? saving : saveContext?.saving;

    return (
        <StyledButton
            variant={variant}
            type={type}
            color={color}
            aria-label={displayedLabel}
            disabled={disabled}
            onClick={handleClick}
            // TODO: find a way to display the loading state (LoadingButton from mui Lab?)
            {...sanitizeButtonRestProps(rest)}
        >
            {finalSaving ? <CircularProgress size={18} thickness={2} /> : icon}
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
    variant?: string;
    // May be injected by Toolbar - sanitized in Button
    record?: RaRecord;
    resource?: string;
    mutationMode?: MutationMode;
}

export type SaveButtonProps<RecordType extends RaRecord = any> = Props<
    RecordType
> &
    ButtonProps & {
        alwaysEnable?: boolean;
    };

SaveButton.propTypes = {
    className: PropTypes.string,
    invalid: PropTypes.bool,
    label: PropTypes.string,
    saving: PropTypes.bool,
    variant: PropTypes.oneOf(['text', 'outlined', 'contained']),
    icon: PropTypes.element,
    alwaysEnable: PropTypes.bool,
};

const PREFIX = 'RaSaveButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    position: 'relative',
    [`& .MuiSvgIcon-root, & .MuiIcon-root, & .MuiCircularProgress-root`]: {
        marginRight: theme.spacing(1),
    },
    [`& .MuiSvgIcon-root, & .MuiIcon-root`]: {
        fontSize: 18,
    },
}));

const valueOrDefault = (value, defaultValue) =>
    typeof value === 'undefined' ? defaultValue : value;
