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

const PREFIX = 'RaButton';

const classes = {
    button: `${PREFIX}-button`,
    label: `${PREFIX}-label`,
    labelRightIcon: `${PREFIX}-labelRightIcon`,
    smallIcon: `${PREFIX}-smallIcon`,
    mediumIcon: `${PREFIX}-mediumIcon`,
    largeIcon: `${PREFIX}-largeIcon`,
};

const StyledButton = styled(MuiButton)({
    [`& .${classes.button}`]: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    [`& .${classes.label}`]: {
        paddingLeft: '0.5em',
    },
    [`& .${classes.labelRightIcon}`]: {
        paddingRight: '0.5em',
    },
    [`& .${classes.smallIcon}`]: {
        fontSize: 20,
    },
    [`& .${classes.mediumIcon}`]: {
        fontSize: 22,
    },
    [`& .${classes.largeIcon}`]: {
        fontSize: 24,
    },
});

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
const Button = (props: ButtonProps) => {
    const {
        alignIcon = 'left',
        children,
        classes: classesOverride,
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
            className={classnames(classes.button, className)}
            color={color}
            size={size}
            aria-label={label ? translate(label, { _: label }) : undefined}
            disabled={disabled}
            {...restProps}
        >
            {alignIcon === 'left' &&
                children &&
                React.cloneElement(children, {
                    className: classes[`${size}Icon`],
                })}
            {label && (
                <span
                    className={classnames({
                        [classes.label]: alignIcon === 'left',
                        [classes.labelRightIcon]: alignIcon !== 'left',
                    })}
                >
                    {translate(label, { _: label })}
                </span>
            )}
            {alignIcon === 'right' &&
                children &&
                React.cloneElement(children, {
                    className: classes[`${size}Icon`],
                })}
        </StyledButton>
    );
};

interface Props {
    alignIcon?: 'left' | 'right';
    children?: ReactElement;
    classes?: object;
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
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(['default', 'inherit', 'primary', 'secondary']),
    disabled: PropTypes.bool,
    label: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default Button;
