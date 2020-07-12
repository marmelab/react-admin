import * as React from 'react';
import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, makeStyles, useMediaQuery } from '@material-ui/core';
import lodashGet from 'lodash/get';
import { setSidebarVisibility, ReduxState } from 'ra-core';
import { ClassesOverride, Theme } from '../types';

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

const useStyles = makeStyles(
    theme => ({
        drawerPaper: {
            position: 'relative',
            height: 'auto',
            overflowX: 'hidden',
            width: (props: SidebarProps & { open?: boolean }) =>
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

const Sidebar: React.FC<SidebarProps> = props => {
    const {
        children,
        closedSize,
        size,
        classes: classesOverride,
        ...rest
    } = props;

    if (
        process.env.NODE_ENV !== 'production' &&
        (closedSize !== undefined || size !== undefined)
    ) {
        console.warn(
            'DEPRECATED: "closedSize" and "size" have been deprecated in 3.0 - https://github.com/marmelab/react-admin/blob/master/UPGRADE.md#the-sidebar-width-must-be-set-through-the-theme'
        );
    }

    const dispatch = useDispatch();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('sm'));
    const open = useSelector((state: ReduxState) => state.admin.ui.sidebarOpen);
    useSelector((state: ReduxState) => state.locale); // force redraw on locale change
    const handleClose = () => dispatch(setSidebarVisibility(false));
    const toggleSidebar = () => dispatch(setSidebarVisibility(!open));
    const classes = useStyles({ ...props, open });

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

interface SidebarProps {
    children: React.ReactNode;
    classes: ClassesOverride<typeof useStyles>;
    closedSize?: unknown;
    size?: unknown;
}

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Sidebar;
