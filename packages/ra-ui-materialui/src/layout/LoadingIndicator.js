import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import compose from 'recompose/compose';

const styles = {
    loader: {
        margin: 16,
    },
};

export const LoadingIndicator = ({ classes, className, isLoading, ...rest }) =>
    isLoading ? (
        <CircularProgress
            className={classNames('app-loader', classes.loader, className)}
            color="inherit"
            size={20}
            thickness={4}
            {...rest}
        />
    ) : null;

LoadingIndicator.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    width: PropTypes.string,
};

const mapStateToProps = state => ({
    isLoading: state.admin.loading > 0,
});

export default compose(
    connect(
        mapStateToProps,
        {} // Avoid connect passing dispatch in props
    ),
    withStyles(styles)
)(LoadingIndicator);
