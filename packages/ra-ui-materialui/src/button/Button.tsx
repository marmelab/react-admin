import * as React from 'react';
import { ReactElement, SyntheticEvent, ReactNode } from 'react';
import PropTypes from 'prop-types';
import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    Tooltip,
    IconButton,
    useMediaQuery,
    PropTypes as MuiPropTypes,
    Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import classnames from 'classnames';
import { Record, RedirectionSideEffect, useTranslate } from 'ra-core';
import { LocationDescriptor } from 'history';

/**
 * A generic Button with side icon. Only the icon is displayed on small screens.
 *
 * The component translates the label. Pass the icon as child.
 * The icon displays on the left side of the button by default. Set alignIcon prop to 'right' to inverse.
 *
 * @example
 *
 * <Button label="Edit" color="secondary" onClick={doEdit}>
 *   <ContentCreate />
 * </Button>
 *
 */
export const Button = (props: ButtonProps) => {
    const {
        alignIcon = 'left',
        children,
        className,
        disabled,
        label,
        color = 'primary',
        size = 'small',
        ...rest
    } = props;
    const translate = useTranslate();

    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const restProps = sanitizeButtonRestProps(rest);

    return isXSmall ? (
        label && !disabled ? (
            <Tooltip title={translate(label, { _: label })}>
                <IconButton
                    aria-label={translate(label, { _: label })}
                    className={className}
                    color={color}
                    {...restProps}
                    size="large"
                >
                    {children}
                </IconButton>
            </Tooltip>
        ) : (
            <IconButton
                className={className}
                color={color}
                disabled={disabled}
                {...restProps}
                size="large"
            >
                {children}
            </IconButton>
        )
    ) : (
        <StyledButton
            className={classnames(ButtonClasses.button, className)}
            color={color}
            size={size}
            aria-label={label ? translate(label, { _: label }) : undefined}
            disabled={disabled}
            {...restProps}
        >
            {alignIcon === 'left' &&
                children &&
                React.cloneElement(children, {
                    className: ButtonClasses[`${size}Icon`],
                })}
            {label && (
                <span
                    className={classnames({
                        [ButtonClasses.label]: alignIcon === 'left',
                        [ButtonClasses.labelRightIcon]: alignIcon !== 'left',
                    })}
                >
                    {translate(label, { _: label })}
                </span>
            )}
            {alignIcon === 'right' &&
                children &&
                React.cloneElement(children, {
                    className: ButtonClasses[`${size}Icon`],
                })}
        </StyledButton>
    );
};

interface Props {
    alignIcon?: 'left' | 'right';
    children?: ReactElement;
    className?: string;
    color?: MuiPropTypes.Color;
    component?: ReactNode;
    to?: string | LocationDescriptor;
    disabled?: boolean;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    icon?: ReactElement;
    redirect?: RedirectionSideEffect;
    variant?: string;
    // May be injected by Toolbar
    basePath?: string;
    handleSubmit?: (event?: SyntheticEvent<HTMLFormElement>) => Promise<Object>;
    handleSubmitWithRedirect?: (redirect?: RedirectionSideEffect) => void;
    invalid?: boolean;
    onSave?: (values: object, redirect: RedirectionSideEffect) => void;
    saving?: boolean;
    submitOnEnter?: boolean;
    pristine?: boolean;
    record?: Record;
    resource?: string;
    undoable?: boolean;
}

export type ButtonProps = Props & MuiButtonProps;

export const sanitizeButtonRestProps = ({
    // The next props are injected by Toolbar
    basePath,
    handleSubmit,
    handleSubmitWithRedirect,
    invalid,
    onSave,
    pristine,
    record,
    redirect,
    resource,
    saving,
    submitOnEnter,
    undoable,
    ...rest
}: any) => rest;

Button.propTypes = {
    alignIcon: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.element,
    className: PropTypes.string,
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    disabled: PropTypes.bool,
    label: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

const PREFIX = 'RaButton';

export const ButtonClasses = {
    button: `${PREFIX}-button`,
    label: `${PREFIX}-label`,
    labelRightIcon: `${PREFIX}-labelRightIcon`,
    smallIcon: `${PREFIX}-smallIcon`,
    mediumIcon: `${PREFIX}-mediumIcon`,
    largeIcon: `${PREFIX}-largeIcon`,
};

const StyledButton = styled(MuiButton, { name: PREFIX })({
    [`& .${ButtonClasses.button}`]: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    [`& .${ButtonClasses.label}`]: {
        paddingLeft: '0.5em',
    },
    [`& .${ButtonClasses.labelRightIcon}`]: {
        paddingRight: '0.5em',
    },
    [`& .${ButtonClasses.smallIcon}`]: {
        fontSize: 20,
    },
    [`& .${ButtonClasses.mediumIcon}`]: {
        fontSize: 22,
    },
    [`& .${ButtonClasses.largeIcon}`]: {
        fontSize: 24,
    },
});
