import * as React from 'react';
import {
    Button as MuiButton,
    ButtonProps as MuiButtonProps,
    Tooltip,
    IconButton,
    useMediaQuery,
    Theme,
} from '@mui/material';
import {
    ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import { useTranslate } from 'ra-core';
import { Path, To } from 'react-router';

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
    inProps: ButtonProps<RootComponent>
) => {
    const props = useThemeProps({ props: inProps, name: PREFIX });
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
    let translatedLabel = label;
    if (typeof label === 'string') {
        translatedLabel = translate(label, {
            _: label,
        });
    }
    const linkParams = getLinkParams(locationDescriptor);

    const isXSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );

    return isXSmall ? (
        label && !disabled ? (
            <Tooltip title={translatedLabel}>
                <IconButton
                    // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
                    aria-label={
                        typeof translatedLabel === 'string'
                            ? translatedLabel
                            : undefined
                    }
                    className={className}
                    color={color}
                    size="large"
                    {...linkParams}
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
                {...linkParams}
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
            // If users provide a ReactNode as label, its their responsibility to also provide an aria-label should they need it
            aria-label={
                typeof translatedLabel === 'string'
                    ? translatedLabel
                    : undefined
            }
            disabled={disabled}
            startIcon={alignIcon === 'left' && children ? children : undefined}
            endIcon={alignIcon === 'right' && children ? children : undefined}
            {...linkParams}
            {...rest}
        >
            {translatedLabel}
        </StyledButton>
    );
};

interface Props<RootComponent extends React.ElementType> {
    alignIcon?: 'left' | 'right';
    children?: React.ReactNode;
    className?: string;
    component?: RootComponent;
    to?: LocationDescriptor | To;
    disabled?: boolean;
    label?: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
    variant?: string;
}

export type ButtonProps<RootComponent extends React.ElementType = 'button'> =
    Props<RootComponent> & MuiButtonProps<RootComponent>;

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

export type LocationDescriptor = Partial<Path> & {
    redirect?: boolean;
    state?: any;
    replace?: boolean;
};

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaButton: 'root';
    }

    interface ComponentsPropsList {
        RaButton: Partial<ButtonProps>;
    }

    interface Components {
        RaButton?: {
            defaultProps?: ComponentsPropsList['RaButton'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaButton'];
        };
    }
}
