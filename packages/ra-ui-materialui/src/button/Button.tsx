import * as React from 'react';
import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    Tooltip,
    IconButton,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { PolymorphicProps } from '@mui/base';

import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useTranslate } from 'ra-core';

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
export const Button = <RootComponent extends React.ElementType = 'button'>(
    props: ButtonProps<RootComponent>
) => {
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
    const translatedLabel = label ? translate(label, { _: label }) : undefined;

    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

    return isXSmall ? (
        label && !disabled ? (
            <Tooltip title={translatedLabel}>
                <IconButton
                    aria-label={translatedLabel}
                    className={className}
                    color={color}
                    size="large"
                    {...rest}
                >
                    {children}
                </IconButton>
            </Tooltip>
        ) : (
            <IconButton
                className={className}
                color={color}
                disabled={disabled}
                size="large"
                {...rest}
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
            {...rest}
        >
            {translatedLabel}
        </StyledButton>
    );
};

interface Props<RootComponent extends React.ElementType> {
    alignIcon?: 'left' | 'right';
    children?: React.ReactElement;
    className?: string;
    component?: RootComponent;
    disabled?: boolean;
    label?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: string;
}

export type ButtonProps<
    RootComponent extends React.ElementType = 'button'
> = Props<RootComponent> & MuiButtonProps<RootComponent>;

Button.propTypes = {
    alignIcon: PropTypes.oneOf(['left', 'right']),
    children: PropTypes.element,
    className: PropTypes.string,
    color: PropTypes.oneOfType([
        PropTypes.oneOf([
            'inherit',
            'default',
            'primary',
            'secondary',
            'error',
            'info',
            'success',
            'warning',
        ]),
        PropTypes.string,
    ]),
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
