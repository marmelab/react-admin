import React, { FC } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress, {
    CircularProgressProps,
} from '@material-ui/core/CircularProgress';

import RefreshIconButton from '../button/RefreshIconButton';
import { ReduxState } from 'ra-core';

const useStyles = makeStyles(
    {
        loader: {
            margin: 14,
        },
    },
    { name: 'RaLoadingIndicator' }
);

export type LoadingIndicatorProps = CircularProgressProps;

const LoadingIndicator: FC<LoadingIndicatorProps> = ({
    classes: classesOverride,
    className,
    ...rest
}) => {
    const loading = useSelector<ReduxState>(state => state.admin.loading > 0);
    const classes = useStyles({ classes: classesOverride });
    return loading ? (
        <CircularProgress
            className={classNames('app-loader', classes.loader, className)}
            color="inherit"
            size={18}
            thickness={5}
            {...rest}
        />
    ) : (
        <RefreshIconButton />
    );
};

LoadingIndicator.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
};

export default LoadingIndicator;
