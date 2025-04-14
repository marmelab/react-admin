import * as React from 'react';
import {
    type ComponentsOverrides,
    styled,
    useTheme,
    type SxProps,
    useThemeProps,
    type Theme,
} from '@mui/material/styles';
import clsx from 'clsx';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoading } from 'ra-core';

import { RefreshIconButton, type RefreshIconButtonProps } from '../button';

export const LoadingIndicator = (inProps: LoadingIndicatorProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const { className, onClick, sx, ...rest } = props;
    const loading = useLoading();

    const theme = useTheme();
    return (
        <Root className={className} sx={sx}>
            <RefreshIconButton
                className={`${LoadingIndicatorClasses.loadedIcon} ${
                    loading && LoadingIndicatorClasses.loadedLoading
                }`}
                onClick={onClick}
            />
            {loading && (
                <CircularProgress
                    className={clsx(
                        'app-loader',
                        LoadingIndicatorClasses.loader
                    )}
                    color="inherit"
                    size={theme.spacing(2)}
                    thickness={6}
                    {...rest}
                />
            )}
        </Root>
    );
};

interface Props {
    className?: string;
    sx?: SxProps<Theme>;
}

type LoadingIndicatorProps = Props & Pick<RefreshIconButtonProps, 'onClick'>;

const PREFIX = 'RaLoadingIndicator';

export const LoadingIndicatorClasses = {
    loader: `${PREFIX}-loader`,
    loadedLoading: `${PREFIX}-loadedLoading`,
    loadedIcon: `${PREFIX}-loadedIcon`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (_, styles) => styles.root,
})({
    position: 'relative',
    [`& .${LoadingIndicatorClasses.loadedIcon}`]: {
        [`&.${LoadingIndicatorClasses.loadedLoading}`]: {
            opacity: 0,
        },
    },
    [`& .${LoadingIndicatorClasses.loader}`]: {
        position: 'absolute',
        top: '30%',
        left: '30%',
    },
});

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaLoadingIndicator: 'root' | 'loader' | 'loadedLoading' | 'loadedIcon';
    }

    interface ComponentsPropsList {
        RaLoadingIndicator: Partial<LoadingIndicatorProps>;
    }

    interface Components {
        RaLoadingIndicator?: {
            defaultProps?: ComponentsPropsList['RaLoadingIndicator'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaLoadingIndicator'];
        };
    }
}
