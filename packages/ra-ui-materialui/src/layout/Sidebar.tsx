import React, { Children, cloneElement, FC } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
    Drawer,
    makeStyles,
    useMediaQuery,
    Theme,
    DrawerProps,
} from '@material-ui/core';
import lodashGet from 'lodash/get';
import { setSidebarVisibility, ReduxState } from 'ra-core';

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

interface StyleProps {
    open: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>(
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

const Sidebar: FC<DrawerProps> = props => {
    const { children, ...rest } = props;
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    const handleClose = () => dispatch(setSidebarVisibility(false));
    const toggleSidebar = () => dispatch(setSidebarVisibility(!open));
    const classes = useStyles({ open });

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
