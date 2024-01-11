import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoading } from 'ra-core';

import { RefreshIconButton, RefreshIconButtonProps } from '../button';
import { SxProps } from '@mui/system';

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
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

LoadingIndicator.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    width: PropTypes.string,
};

interface Props {
    className?: string;
    sx?: SxProps;
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
