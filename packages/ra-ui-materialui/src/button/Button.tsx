import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
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
import {
    MutationMode,
    RaRecord,
    RedirectionSideEffect,
    useTranslate,
} from 'ra-core';
import { Path } from 'react-router';

export type LocationDescriptor = Partial<Path> & {
    redirect?: boolean;
    state?: any;
    replace?: boolean;
};

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
        to: locationDescriptor,
        ...rest
    } = props;
    const translate = useTranslate();
    const translatedLabel = label ? translate(label, { _: label }) : undefined;
    const linkParams = getLinkParams(locationDescriptor);

    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    const restProps = sanitizeButtonRestProps(rest);

    return isXSmall ? (
        label && !disabled ? (
            <Tooltip title={translatedLabel}>
                <IconButton
                    aria-label={translatedLabel}
                    className={className}
                    color={color}
                    {...restProps}
                    {...linkParams}
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
                {...linkParams}
                size="large"
            >
                {children}
            </IconButton>
        )
    ) : (
        <StyledButton
            className={className}
            color={color}
            size={size}
            aria-label={translatedLabel}
            disabled={disabled}
            startIcon={alignIcon === 'left' && children ? children : undefined}
            endIcon={alignIcon === 'right' && children ? children : undefined}
            {...restProps}
            {...linkParams}
        >
            {translatedLabel}
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
    record?: RaRecord;
    resource?: string;
    mutationMode?: MutationMode;
}

export type ButtonProps = Props & MuiButtonProps;

export const sanitizeButtonRestProps = ({
    // The next props are injected by Toolbar
    invalid,
    pristine,
    record,
    redirect,
    resource,
    mutationMode,
    hasCreate,
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

const StyledButton = styled(MuiButton, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})({
    '&.MuiButton-sizeSmall': {
        // fix for icon misalignment on small buttons, see https://github.com/mui/material-ui/pull/30240
        lineHeight: 1.5,
    },
});

const getLinkParams = (locationDescriptor?: LocationDescriptor | string) => {
    // eslint-disable-next-line eqeqeq
    if (locationDescriptor == undefined) {
        return undefined;
    }

    if (typeof locationDescriptor === 'string') {
        return { to: locationDescriptor };
    }

    const { redirect, replace, state, ...to } = locationDescriptor;
    return {
        to,
        redirect,
        replace,
        state,
    };
};
