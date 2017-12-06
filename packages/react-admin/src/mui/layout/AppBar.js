import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';

import { toggleSidebar as toggleSidebarAction } from '../../actions';
import { DRAWER_WIDTH } from './Sidebar';

const styles = theme => ({
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: DRAWER_WIDTH,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
});

const AppBar = ({ classes, className, open, title, toggleSidebar }) => (
    <MuiAppBar
        className={classNames(
            classes.appBar,
            open && classes.appBarShift,
            className
        )}
    >
        <Toolbar disableGutters={!open}>
            <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={toggleSidebar}
                className={classNames(classes.menuButton, open && classes.hide)}
            >
                <MenuIcon />
            </IconButton>
            <Typography type="title" color="inherit">
                {title}
            </Typography>
        </Toolbar>
    </MuiAppBar>
);

AppBar.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    open: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
        .isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

const enhance = compose(
    connect(null, {
        toggleSidebar: toggleSidebarAction,
    }),
    withStyles(styles)
);

export default enhance(AppBar);
