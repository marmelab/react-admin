import * as React from 'react';
import { type MouseEventHandler, useCallback } from 'react';
import type { UseMutationOptions } from '@tanstack/react-query';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { Button, type ButtonProps, CircularProgress } from '@mui/material';
import ContentSave from '@mui/icons-material/Save';
import { useFormContext, useFormState } from 'react-hook-form';
import {
    type CreateParams,
    type RaRecord,
    type TransformData,
    type UpdateParams,
    useSaveContext,
    useTranslate,
    warning,
    setSubmissionErrors,
    useRecordFromLocation,
    useFormIsDirty,
} from 'ra-core';

/**
 * Submit button for resource forms (Edit and Create).
 *
 * @typedef {Object} Props the props you can use (other props are injected by the <Toolbar>)
 * @prop {string} className
 * @prop {string} label Button label. Defaults to 'ra.action.save', translated.
 * @prop {boolean} disabled Disable the button.
 * @prop {string} variant Material UI variant for the button. Defaults to 'contained'.
 * @prop {ReactNode} icon
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
    inProps: SaveButtonProps<RecordType>
) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        color = 'primary',
        icon = defaultIcon,
        invalid,
        label = 'ra.action.save',
        onClick,
        mutationOptions,
        disabled: disabledProp,
        type = 'submit',
        transform,
        variant = 'contained',
        alwaysEnable = false,
        ...rest
    } = props;
    const translate = useTranslate();
    const form = useFormContext();
    const saveContext = useSaveContext();
    const { isValidating, isSubmitting } = useFormState();
    // useFormState().isDirty might differ from useFormState().dirtyFields (https://github.com/react-hook-form/react-hook-form/issues/4740)
    const isDirty = useFormIsDirty();
    // Use form isDirty, isValidating and form context saving to enable or disable the save button
    // if alwaysEnable is undefined and the form wasn't prefilled
    const recordFromLocation = useRecordFromLocation();
    const disabled = valueOrDefault(
        alwaysEnable === false || alwaysEnable === undefined
            ? undefined
            : !alwaysEnable,
        disabledProp ||
            (!isDirty && recordFromLocation == null) ||
            isValidating ||
            isSubmitting
    );

    warning(
        type === 'submit' &&
            ((mutationOptions &&
                (mutationOptions.onSuccess || mutationOptions.onError)) ||
                transform),
        'Cannot use <SaveButton mutationOptions> props on a button of type "submit". To override the default mutation options on a particular save button, set the <SaveButton type="button"> prop, or set mutationOptions in the main view component (<Create> or <Edit>).'
    );

    const handleSubmit = useCallback(
        async values => {
            let errors;
            if (saveContext?.save) {
                errors = await saveContext.save(values, {
                    ...mutationOptions,
                    transform,
                });
            }
            if (errors != null) {
                setSubmissionErrors(errors, form.setError);
            }
        },
        [form.setError, saveContext, mutationOptions, transform]
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
                event.stopPropagation();
                await form.handleSubmit(handleSubmit)(event);
            }
        },
        [onClick, type, form, handleSubmit]
    );

    const displayedLabel = label && translate(label, { _: label });

    return (
        <StyledButton
            variant={variant}
            type={type}
            color={color}
            aria-label={displayedLabel}
            disabled={disabled}
            onClick={handleClick}
            {...rest}
        >
            {isSubmitting ? (
                <CircularProgress
                    sx={circularProgressStyle}
                    size={14}
                    thickness={3}
                    color="inherit"
                />
            ) : (
                icon
            )}
            {displayedLabel}
        </StyledButton>
    );
};

const circularProgressStyle = {
    '&.MuiCircularProgress-root': {
        marginRight: '10px',
        marginLeft: '2px',
    },
};

const defaultIcon = <ContentSave />;

interface Props<
    RecordType extends RaRecord = any,
    MutationOptionsError = unknown,
> {
    className?: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    invalid?: boolean;
    label?: string;
    mutationOptions?: UseMutationOptions<
        RecordType,
        MutationOptionsError,
        CreateParams<RecordType> | UpdateParams<RecordType>
    >;
    transform?: TransformData;
    variant?: string;
}

export type SaveButtonProps<RecordType extends RaRecord = any> =
    Props<RecordType> &
        ButtonProps & {
            alwaysEnable?: boolean;
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaSaveButton: 'root';
    }

    interface ComponentsPropsList {
        RaSaveButton: Partial<SaveButtonProps>;
    }

    interface Components {
        RaSaveButton?: {
            defaultProps?: ComponentsPropsList['RaSaveButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaSaveButton'];
        };
    }
}
