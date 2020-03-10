import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import RefreshIconButton from '../button/RefreshIconButton';

const useStyles = makeStyles(
    {
        loader: {
            margin: 14,
        },
    },
    { name: 'RaLoadingIndicator' }
);

const LoadingIndicator = props => {
    const { classes: classesOverride, className, ...rest } = props;
    const loading = useSelector(state => state.admin.loading > 0);
    const classes = useStyles(props);
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
    width: PropTypes.string,
};

export default LoadingIndicator;
