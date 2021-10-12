import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, DrawerProps, useMediaQuery, Theme } from '@mui/material';
import lodashGet from 'lodash/get';
import { setSidebarVisibility, ReduxState, useLocale } from 'ra-core';

const PREFIX = 'RaSidebar';

const classes = {
    root: `${PREFIX}-root`,
    docked: `${PREFIX}-docked`,
    paper: `${PREFIX}-paper`,
    paperAnchorLeft: `${PREFIX}-paperAnchorLeft`,
    paperAnchorRight: `${PREFIX}-paperAnchorRight`,
    paperAnchorTop: `${PREFIX}-paperAnchorTop`,
    paperAnchorBottom: `${PREFIX}-paperAnchorBottom`,
    paperAnchorDockedLeft: `${PREFIX}-paperAnchorDockedLeft`,
    paperAnchorDockedTop: `${PREFIX}-paperAnchorDockedTop`,
    paperAnchorDockedRight: `${PREFIX}-paperAnchorDockedRight`,
    paperAnchorDockedBottom: `${PREFIX}-paperAnchorDockedBottom`,
    modal: `${PREFIX}-modal`,
    fixed: `${PREFIX}-fixed`,
};

const StyledDrawer = styled(Drawer)(({ open, theme }) => ({
    [`&.${classes.root}`]: {
        height: 'calc(100vh - 3em)',
    },

    [`& .${classes.docked}`]: {},
    [`& .${classes.paper}`]: {},
    [`& .${classes.paperAnchorLeft}`]: {},
    [`& .${classes.paperAnchorRight}`]: {},
    [`& .${classes.paperAnchorTop}`]: {},
    [`& .${classes.paperAnchorBottom}`]: {},
    [`& .${classes.paperAnchorDockedLeft}`]: {},
    [`& .${classes.paperAnchorDockedTop}`]: {},
    [`& .${classes.paperAnchorDockedRight}`]: {},
    [`& .${classes.paperAnchorDockedBottom}`]: {},
    [`& .${classes.modal}`]: {},

    [`& .${classes.fixed}`]: {
        position: 'fixed',
        height: 'calc(100vh - 3em)',
        overflowX: 'hidden',
        // hide scrollbar
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },

    [`& .MuiPaper-root`]: {
        position: 'relative',
        width: open
            ? lodashGet(theme, 'sidebar.width', DRAWER_WIDTH)
            : lodashGet(theme, 'sidebar.closedWidth', CLOSED_DRAWER_WIDTH),
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
}));

export const DRAWER_WIDTH = 240;
export const CLOSED_DRAWER_WIDTH = 55;

const Sidebar = (props: SidebarProps) => {
    const { children, closedSize, size, ...rest } = props;
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    const open = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );
    useLocale(); // force redraw on locale change
    const toggleSidebar = () => dispatch(setSidebarVisibility(!open));

    return isXSmall ? (
        <StyledDrawer
            variant="temporary"
            open={open}
            onClose={toggleSidebar}
            classes={classes}
            {...rest}
        >
            {children}
        </StyledDrawer>
    ) : isSmall ? (
        <StyledDrawer
            variant="permanent"
            open={open}
            onClose={toggleSidebar}
            classes={classes}
            {...rest}
        >
            <div className={classes.fixed}>{children}</div>
        </StyledDrawer>
    ) : (
        <StyledDrawer
            variant="permanent"
            open={open}
            onClose={toggleSidebar}
            classes={classes}
            {...rest}
        >
            <div className={classes.fixed}>{children}</div>
        </StyledDrawer>
    );
};

Sidebar.propTypes = {
    children: PropTypes.node.isRequired,
};

export interface SidebarProps extends DrawerProps {
    children: ReactElement;
    closedSize?: number;

    size?: number;
}

export default Sidebar;
