import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import { Typography, type SxProps } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTimeout, useTranslate } from 'ra-core';

export const Loading = (inProps: LoadingProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        className,
        loadingPrimary = 'ra.page.loading',
        loadingSecondary = 'ra.message.loading',
        ...rest
    } = props;
    const oneSecondHasPassed = useTimeout(1000);
    const translate = useTranslate();
    return oneSecondHasPassed ? (
        <Root className={className} {...rest}>
            <div className={LoadingClasses.message}>
                <CircularProgress className={LoadingClasses.icon} />
                <Typography variant="h5" mt={3} color="text.secondary">
                    {translate(loadingPrimary, { _: loadingPrimary })}
                </Typography>
                <Typography variant="body2">
                    {translate(loadingSecondary, { _: loadingSecondary })}
                </Typography>
            </div>
        </Root>
    ) : null;
};

export interface LoadingProps {
    className?: string;
    loadingPrimary?: string;
    loadingSecondary?: string;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaLoading';

export const LoadingClasses = {
    root: `${PREFIX}-root`,
    icon: `${PREFIX}-icon`,
    message: `${PREFIX}-message`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    [`& .${LoadingClasses.message}`]: {
        textAlign: 'center',
        fontFamily: 'Roboto, sans-serif',
        color: theme.palette.text.disabled,
        paddingTop: '1em',
        paddingBottom: '1em',
    },
    [`& .${LoadingClasses.icon}`]: {
        width: '9em',
        height: '9em',
    },
}));

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLoading: 'root' | 'icon' | 'message';
    }

    interface ComponentsPropsList {
        RaLoading: Partial<LoadingProps>;
    }

    interface Components {
        RaLoading?: {
            defaultProps?: ComponentsPropsList['RaLoading'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLoading'];
        };
    }
}
