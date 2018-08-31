import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import compose from 'recompose/compose';
import { toggleSidebar } from 'ra-core';

import LoadingIndicator from './LoadingIndicator';

const styles = {
    title: {
        fontSize: '1.25em',
        lineHeight: '2.5em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        paddingRight: '1.5em',
    },
    icon: {
        marginTop: 0,
        marginRight: 0,
        marginLeft: '-12px',
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
};

/**
 * @deprecated
 */
const AppBarMobile = ({
    classes,
    className,
    title,
    toggleSidebar,
    ...rest
}) => {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(
            '<AppBarMobile> is deprecated, please use <AppBar>, which is now responsive'
        );
    }
    return (
        <MuiAppBar
            className={className}
            color="secondary"
            position="fixed"
            {...rest}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={toggleSidebar}
                    className={classes.icon}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    className={classes.title}
                    variant="title"
                    color="inherit"
                >
                    {title}
                </Typography>
                <LoadingIndicator />
            </Toolbar>
        </MuiAppBar>
    );
};

AppBarMobile.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    connect(
        null,
        { toggleSidebar }
    ),
    withStyles(styles)
);

export default enhance(AppBarMobile);
