import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { useLoading } from 'ra-core';

import { RefreshIconButton } from '../button';

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
    const { className, ...rest } = props;
    const loading = useLoading();

    const theme = useTheme();
    return (
        <Root className={className}>
            {loading ? (
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
            ) : (
                <RefreshIconButton
                    className={LoadingIndicatorClasses.loadedIcon}
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

interface LoadingIndicatorProps {
    className?: string;
}

const PREFIX = 'RaLoadingIndicator';

export const LoadingIndicatorClasses = {
    loader: `${PREFIX}-loader`,
    loadedIcon: `${PREFIX}-loadedIcon`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${LoadingIndicatorClasses.loader}`]: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },

    [`& .${LoadingIndicatorClasses.loadedIcon}`]: {},
}));
