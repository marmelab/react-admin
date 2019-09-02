import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import RefreshIconButton from '../button/RefreshIconButton';

const useStyles = makeStyles({
    loader: {
        margin: 14,
    },
});

export const LoadingIndicator = ({
    classes: classesOverride,
    className,
    isLoading,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
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
    classes: PropTypes.object,
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
