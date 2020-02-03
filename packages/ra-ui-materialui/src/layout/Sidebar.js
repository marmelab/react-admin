import React, { useEffect, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, makeStyles, useMediaQuery } from '@material-ui/core';
import lodashGet from 'lodash/get';
import { setSidebarVisibility } from 'ra-core';

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

const useStyles = makeStyles(
    theme => ({
        drawerPaper: {
            position: 'relative',
            height: 'auto',
            overflowX: 'hidden',
            width: props =>
                props.open
                    ? lodashGet(theme, 'sidebar.width', DRAWER_WIDTH)
                    : lodashGet(
                          theme,
                          'sidebar.closedWidth',
                          CLOSED_DRAWER_WIDTH
                      ),
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
            zIndex: 'inherit',
        },
    }),
    { name: 'RaSidebar' }
);

const Sidebar = ({
    children,
    closedSize,
    size,
    classes: classesOverride,
    ...rest
}) => {
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));
    // FIXME negating isXSmall and isSmall should be enough, but unfortunately
    // mui media queries use a two pass system and are always false at first
    // see https://github.com/mui-org/material-ui/issues/14336
    const isDesktop = useMediaQuery(theme => theme.breakpoints.up('md'));
    useEffect(() => {
        if (isDesktop) {
            dispatch(setSidebarVisibility(true)); // FIXME renders with a closed sidebar at first
        }
    }, [isDesktop, dispatch]);
    const open = useSelector(state => state.admin.ui.sidebarOpen);
    useSelector(state => state.locale); // force redraw on locale change
    const handleClose = () => dispatch(setSidebarVisibility(false));
    const toggleSidebar = () => dispatch(setSidebarVisibility(!open));
    const classes = useStyles({ classes: classesOverride, open });

    return isXSmall ? (
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
    ) : isSmall ? (
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
                onMenuClick: handleClose,
            })}
        </Drawer>
    ) : (
        <Drawer
            variant="permanent"
            open={open}
            PaperProps={{
                className: classes.drawerPaper,
            }}
            onClose={toggleSidebar}
            {...rest}
        >
            {children}
        </Drawer>
    );
};

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Sidebar;
