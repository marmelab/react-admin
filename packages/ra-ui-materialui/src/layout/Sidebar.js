import React, { Children, cloneElement, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import { setSidebarVisibility } from 'ra-core';
import lodashGet from 'lodash/get';
import Responsive from './Responsive';

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

const useStyles = makeStyles(theme => ({
    drawerPaper: {
        position: 'relative',
        height: 'auto',
        overflowX: 'hidden',
        width: props =>
            props.open
                ? lodashGet(theme, 'sidebar.width', DRAWER_WIDTH)
                : lodashGet(theme, 'sidebar.closedWidth', CLOSED_DRAWER_WIDTH),
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: 'transparent',
        marginTop: '0.5em',
        borderRight: 'none',
        [theme.breakpoints.only('xs')]: {
            marginTop: 0,
            height: '100vh',
            position: 'inherit',
            backgroundColor: theme.palette.background.default,
        },
        [theme.breakpoints.up('md')]: {
            border: 'none',
            marginTop: '1.5em',
        },
    },
}));

const Sidebar = ({ width, setSidebarVisibility, open, children, ...rest }) => {
    const classes = useStyles();

    useLayoutEffect(() => {
        if (width !== 'xs' && width !== 'sm') {
            setSidebarVisibility(true);
        }
    }, [setSidebarVisibility, width]);

    const handleClose = () => setSidebarVisibility(false);

    const toggleSidebar = () => setSidebarVisibility(!open);

    return (
        <Responsive
            xsmall={
                <Drawer
                    variant="temporary"
                    open={open}
                    PaperProps={{
                        className: classes.drawerPaper,
                    }}
                    onClose={toggleSidebar}
                    {...rest}
                >
                    {cloneElement(Children.only(children), {
                        onMenuClick: handleClose,
                    })}
                </Drawer>
            }
            small={
                <Drawer
                    variant="permanent"
                    open={open}
                    PaperProps={{
                        className: classes.drawerPaper,
                    }}
                    onClose={toggleSidebar}
                    {...rest}
                >
                    {cloneElement(Children.only(children), {
                        dense: true,
                        onMenuClick: handleClose,
                    })}
                </Drawer>
            }
            medium={
                <Drawer
                    variant="permanent"
                    open={open}
                    PaperProps={{
                        className: classes.drawerPaper,
                    }}
                    onClose={toggleSidebar}
                    {...rest}
                >
                    {cloneElement(Children.only(children), { dense: true })}
                </Drawer>
            }
        />
    );
};

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
    open: PropTypes.bool.isRequired,
    setSidebarVisibility: PropTypes.func.isRequired,
    width: PropTypes.string,
};

const mapStateToProps = state => ({
    open: state.admin.ui.sidebarOpen,
    locale: state.locale, // force redraw on locale change
});

export default compose(
    connect(
        mapStateToProps,
        { setSidebarVisibility }
    ),
    withWidth({ resizeInterval: Infinity }) // used to initialize the visibility on first render
)(Sidebar);
