import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import withWidth from 'material-ui/utils/withWidth';
import { CircularProgress } from 'material-ui/Progress';
import compose from 'recompose/compose';

const styles = {
    loader: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 16,
        zIndex: 1200,
        color: 'white',
    },
};

export const LoadingIndicator = ({ classes, isLoading, width }) =>
    isLoading ? (
        <CircularProgress
            className={classNames('app-loader', classes.loader)}
            size={width === 'xs' || width === 'sm' ? 20 : 30}
            thickness={2}
        />
    ) : null;

LoadingIndicator.propTypes = {
    classes: PropTypes.object,
    isLoading: PropTypes.bool,
    width: PropTypes.string,
};

const mapStateToProps = state => ({
    isLoading: state.admin.loading > 0,
});

export default compose(
    connect(mapStateToProps),
    withStyles(styles),
    withWidth()
)(LoadingIndicator);
