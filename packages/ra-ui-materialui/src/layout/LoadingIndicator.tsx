import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ReduxState, useRefreshWhenVisible } from 'ra-core';

import RefreshIconButton from '../button/RefreshIconButton';
import { ClassesOverride } from '../types';

const LoadingIndicator = (props: LoadingIndicatorProps) => {
    const { classes: classesOverride, className, ...rest } = props;
    useRefreshWhenVisible();
    const loading = useSelector<ReduxState>(state => state.admin.loading > 0);
    const classes = useStyles(props);
    const theme = useTheme();
    return loading ? (
        <CircularProgress
            className={classNames('app-loader', classes.loader, className)}
            color="inherit"
            size={theme.spacing(2)}
            thickness={6}
            {...rest}
        />
    ) : (
        <RefreshIconButton className={classes.loadedIcon} />
    );
};

const useStyles = makeStyles(
    theme => ({
        loader: {
            margin: theme.spacing(2),
        },
        loadedIcon: {},
    }),
    { name: 'RaLoadingIndicator' }
);

LoadingIndicator.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    width: PropTypes.string,
};

interface LoadingIndicatorProps {
    className?: string;
    classes?: ClassesOverride<typeof useStyles>;
}

export default LoadingIndicator;
