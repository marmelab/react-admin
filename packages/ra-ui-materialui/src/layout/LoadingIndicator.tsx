import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { ReduxState, useRefreshWhenVisible } from 'ra-core';

import { RefreshIconButton } from '../button';

export const LoadingIndicator = (props: LoadingIndicatorProps) => {
    const { className, ...rest } = props;
    useRefreshWhenVisible();
    const loading = useSelector<ReduxState>(state => state.admin.loading > 0);

    const theme = useTheme();
    return (
        <Root>
            {loading ? (
                <CircularProgress
                    className={classNames(
                        'app-loader',
                        LoadingIndicatorClasses.loader,
                        className
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

const Root = styled('div', { name: PREFIX })(({ theme }) => ({
    [`& .${LoadingIndicatorClasses.loader}`]: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },

    [`& .${LoadingIndicatorClasses.loadedIcon}`]: {},
}));
