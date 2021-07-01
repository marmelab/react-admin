import * as React from 'react';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, DrawerProps, useMediaQuery, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import lodashGet from 'lodash/get';
import { setSidebarVisibility, ReduxState, useLocale } from 'ra-core';
import { ClassesOverride } from '../types';

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

const Sidebar = (props: SidebarProps) => {
    const {
        children,
        closedSize,
        size,
        classes: classesOverride,
        ...rest
    } = props;
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const open = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );
    useLocale(); // force redraw on locale change
    const toggleSidebar = () => dispatch(setSidebarVisibility(!open));
    const { drawerPaper, ...classes } = useStyles({ ...props, open });

    return isXSmall ? (
        <Drawer
            variant="temporary"
            open={open}
            PaperProps={{
                className: drawerPaper,
            }}
            onClose={toggleSidebar}
            classes={classes}
            {...rest}
        >
            {children}
        </Drawer>
    ) : isSmall ? (
        <Drawer
            variant="permanent"
            open={open}
            PaperProps={{
                className: drawerPaper,
            }}
            onClose={toggleSidebar}
            classes={classes}
            {...rest}
        >
            {children}
        </Drawer>
    ) : (
        <Drawer
            variant="permanent"
            open={open}
            PaperProps={{
                className: drawerPaper,
            }}
            onClose={toggleSidebar}
            classes={classes}
            {...rest}
        >
            {children}
        </Drawer>
    );
};

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

const useStyles = makeStyles(
    theme => ({
        root: {},
        docked: {},
        paper: {},
        paperAnchorLeft: {},
        paperAnchorRight: {},
        paperAnchorTop: {},
        paperAnchorBottom: {},
        paperAnchorDockedLeft: {},
        paperAnchorDockedTop: {},
        paperAnchorDockedRight: {},
        paperAnchorDockedBottom: {},
        modal: {},
        drawerPaper: {
            position: 'relative',
            height: '100%',
            overflowX: 'hidden',
            width: (props: { open?: boolean }) =>
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
            borderRight: 'none',
            [theme.breakpoints.only('xs')]: {
                marginTop: 0,
                height: '100vh',
                position: 'inherit',
                backgroundColor: theme.palette.background.default,
            },
            [theme.breakpoints.up('md')]: {
                border: 'none',
            },
            zIndex: 'inherit',
        },
    }),
    { name: 'RaSidebar' }
);

export interface SidebarProps extends DrawerProps {
    children: ReactElement;
    closedSize?: number;
    classes: ClassesOverride<typeof useStyles>;
    size?: number;
}

export default Sidebar;
