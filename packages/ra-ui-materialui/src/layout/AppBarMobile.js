import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import compose from 'recompose/compose';
import { toggleSidebar } from 'ra-core';
import Headroom from 'react-headroom';

import LoadingIndicator from './LoadingIndicator';

const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        zIndex: 1300,
    },
    title: {
        fontSize: '1.25em',
        lineHeight: '2.5em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
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
    loadingIndicator: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 1200,
    },
});

const styleHeadroom = {
    position: 'fixed',
};

const AppBarMobile = ({
    classes,
    className,
    title,
    toggleSidebar,
    ...rest
}) => (
    <Headroom className={classNames(classes.appBar)} style={styleHeadroom}>
        <MuiAppBar
            className={className}
            color="secondary"
            position="static"
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
                <LoadingIndicator className={classes.loadingIndicator} />
            </Toolbar>
        </MuiAppBar>
    </Headroom>
);

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
