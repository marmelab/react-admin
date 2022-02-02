import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import { Drawer, DrawerProps, useMediaQuery, Theme } from '@mui/material';
import lodashGet from 'lodash/get';
import { useLocale } from 'ra-core';

import { useSidebarState } from './useSidebarState';

export const Sidebar = (props: SidebarProps) => {
    const { children, closedSize, size, ...rest } = props;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const isSmall = useMediaQuery<Theme>(theme => theme.breakpoints.down('md'));
    const [open, setOpen] = useSidebarState();
    useLocale(); // force redraw on locale change

    const toggleSidebar = () => setOpen(!open);

    return isXSmall ? (
        <StyledDrawer
            variant="temporary"
            open={open}
            onClose={toggleSidebar}
            classes={SidebarClasses}
            {...rest}
        >
            {children}
        </StyledDrawer>
    ) : isSmall ? (
        <StyledDrawer
            variant="permanent"
            open={open}
            onClose={toggleSidebar}
            classes={SidebarClasses}
            {...rest}
        >
            <div className={SidebarClasses.fixed}>{children}</div>
        </StyledDrawer>
    ) : (
        <StyledDrawer
            variant="permanent"
            open={open}
            onClose={toggleSidebar}
            classes={SidebarClasses}
            {...rest}
        >
            <div className={SidebarClasses.fixed}>{children}</div>
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

const PREFIX = 'RaSidebar';

export const SidebarClasses = {
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

const StyledDrawer = styled(Drawer, {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (props, styles) => [
        { [`& .${SidebarClasses.docked}`]: styles.docked },
        { [`& .${SidebarClasses.paper}`]: styles.paper },
        { [`& .${SidebarClasses.paperAnchorLeft}`]: styles.paperAnchorLeft },
        { [`& .${SidebarClasses.paperAnchorRight}`]: styles.paperAnchorRight },
        { [`& .${SidebarClasses.paperAnchorTop}`]: styles.paperAnchorTop },
        {
            [`& .${SidebarClasses.paperAnchorBottom}`]: styles.paperAnchorBottom,
        },
        {
            [`& .${SidebarClasses.paperAnchorDockedLeft}`]: styles.paperAnchorDockedLeft,
        },
        {
            [`& .${SidebarClasses.paperAnchorDockedTop}`]: styles.paperAnchorDockedTop,
        },
        {
            [`& .${SidebarClasses.paperAnchorDockedRight}`]: styles.paperAnchorDockedRight,
        },
        {
            [`& .${SidebarClasses.paperAnchorDockedBottom}`]: styles.paperAnchorDockedBottom,
        },
        { [`& .${SidebarClasses.modal}`]: styles.modal },
        { [`& .${SidebarClasses.fixed}`]: styles.fixed },
        styles.root,
    ],
})(({ open, theme }) => ({
    height: 'calc(100vh - 3em)',

    [`& .${SidebarClasses.docked}`]: {},
    [`& .${SidebarClasses.paper}`]: {},
    [`& .${SidebarClasses.paperAnchorLeft}`]: {},
    [`& .${SidebarClasses.paperAnchorRight}`]: {},
    [`& .${SidebarClasses.paperAnchorTop}`]: {},
    [`& .${SidebarClasses.paperAnchorBottom}`]: {},
    [`& .${SidebarClasses.paperAnchorDockedLeft}`]: {},
    [`& .${SidebarClasses.paperAnchorDockedTop}`]: {},
    [`& .${SidebarClasses.paperAnchorDockedRight}`]: {},
    [`& .${SidebarClasses.paperAnchorDockedBottom}`]: {},
    [`& .${SidebarClasses.modal}`]: {},

    [`& .${SidebarClasses.fixed}`]: {
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
