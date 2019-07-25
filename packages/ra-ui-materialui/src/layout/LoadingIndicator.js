import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import RefreshIconButton from '../button/RefreshIconButton';

const useStyles = makeStyles(
    createStyles({
        loader: {
            margin: 14,
        },
    })
);

export const LoadingIndicator = ({ className, isLoading, ...rest }) => {
    const classes = useStyles();

    return isLoading ? (
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
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    width: PropTypes.string,
};

const mapStateToProps = state => ({
    isLoading: state.admin.loading > 0,
});

export default connect(
    mapStateToProps,
    {} // Avoid connect passing dispatch in props
)(LoadingIndicator);
