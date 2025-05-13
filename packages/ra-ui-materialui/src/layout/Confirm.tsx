import * as React from 'react';
import { useCallback, type MouseEventHandler, type ComponentType } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    type DialogProps,
    DialogTitle,
} from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import ActionCheck from '@mui/icons-material/CheckCircle';
import AlertError from '@mui/icons-material/ErrorOutline';
import clsx from 'clsx';
import { useTranslate } from 'ra-core';

/**
 * Confirmation dialog
 *
 * @example
 * <Confirm
 *     isOpen={true}
 *     title="Delete Item"
 *     content="Are you sure you want to delete this item?"
 *     confirm="Yes"
 *     confirmColor="primary"
 *     ConfirmIcon=ActionCheck
 *     CancelIcon=AlertError
 *     cancel="Cancel"
 *     onConfirm={() => { // do something }}
 *     onClose={() => { // do something }}
 * />
 */
export const Confirm = (inProps: ConfirmProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        isOpen = false,
        loading,
        title,
        content,
        cancel = 'ra.action.cancel',
        confirm = 'ra.action.confirm',
        confirmColor = 'primary',
        ConfirmIcon = ActionCheck,
        CancelIcon = AlertError,
        onClose,
        onConfirm,
        translateOptions = {},
        titleTranslateOptions = translateOptions,
        contentTranslateOptions = translateOptions,
        ...rest
    } = props;

    const translate = useTranslate();

    const handleConfirm = useCallback(
        e => {
            e.stopPropagation();
            onConfirm(e);
        },
        [onConfirm]
    );

    const handleClick = useCallback(e => {
        e.stopPropagation();
    }, []);

    return (
        <StyledDialog
            className={className}
            open={isOpen}
            onClose={onClose}
            onClick={handleClick}
            aria-labelledby="alert-dialog-title"
            {...rest}
        >
            <DialogTitle id="alert-dialog-title">
                {typeof title === 'string'
                    ? translate(title, { _: title, ...titleTranslateOptions })
                    : title}
            </DialogTitle>
            <DialogContent>
                {typeof content === 'string' ? (
                    <DialogContentText>
                        {translate(content, {
                            _: content,
                            ...contentTranslateOptions,
                        })}
                    </DialogContentText>
                ) : (
                    content
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={loading}
                    onClick={onClose}
                    startIcon={<CancelIcon />}
                >
                    {translate(cancel, { _: cancel })}
                </Button>
                <Button
                    disabled={loading}
                    onClick={handleConfirm}
                    className={clsx('ra-confirm', {
                        [ConfirmClasses.confirmWarning]:
                            confirmColor === 'warning',
                        [ConfirmClasses.confirmPrimary]:
                            confirmColor === 'primary',
                    })}
                    autoFocus
                    startIcon={<ConfirmIcon />}
                >
                    {translate(confirm, { _: confirm })}
                </Button>
            </DialogActions>
        </StyledDialog>
    );
};

export interface ConfirmProps
    extends Omit<DialogProps, 'open' | 'onClose' | 'title' | 'content'> {
    cancel?: string;
    className?: string;
    confirm?: string;
    confirmColor?: 'primary' | 'warning';
    ConfirmIcon?: ComponentType;
    CancelIcon?: ComponentType;
    content: React.ReactNode;
    isOpen?: boolean;
    loading?: boolean;
    onClose: MouseEventHandler;
    onConfirm: MouseEventHandler;
    title: React.ReactNode;
    /**
     * @deprecated use `titleTranslateOptions` and `contentTranslateOptions` instead
     */
    translateOptions?: object;
    titleTranslateOptions?: object;
    contentTranslateOptions?: object;
}

const PREFIX = 'RaConfirm';

export const ConfirmClasses = {
    confirmPrimary: `${PREFIX}-confirmPrimary`,
    confirmWarning: `${PREFIX}-confirmWarning`,
};

const StyledDialog = styled(Dialog, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${ConfirmClasses.confirmPrimary}`]: {
        color: (theme.vars || theme).palette.primary.main,
    },

    [`& .${ConfirmClasses.confirmWarning}`]: {
        color: (theme.vars || theme).palette.error.main,
        '&:hover': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars || theme).palette.error.main}, transparent 12%)`,
            // Reset on mouse devices
            '@media (hover: none)': {
                backgroundColor: 'transparent',
            },
        },
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaConfirm: 'root' | 'confirmPrimary' | 'confirmWarning';
    }

    interface ComponentsPropsList {
        RaConfirm: Partial<ConfirmProps>;
    }

    interface Components {
        RaConfirm?: {
            defaultProps?: ComponentsPropsList['RaConfirm'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaConfirm'];
        };
    }
}
