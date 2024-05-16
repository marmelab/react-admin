import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import {
    Drawer,
    DrawerProps,
    useMediaQuery,
    Theme,
    useScrollTrigger,
} from '@mui/material';
import lodashGet from 'lodash/get';
import { useLocale } from 'ra-core';

import { useSidebarState } from './useSidebarState';

export const Sidebar = (props: SidebarProps) => {
    const { appBarAlwaysOn, children, closedSize, size, ...rest } = props;
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );
    const [open, setOpen] = useSidebarState();
    useLocale(); // force redraw on locale change
    const trigger = useScrollTrigger();

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
    ) : (
        <StyledDrawer
            variant="permanent"
            open={open}
            onClose={toggleSidebar}
            classes={SidebarClasses}
            className={
                trigger && !appBarAlwaysOn ? SidebarClasses.appBarCollapsed : ''
            }
            {...rest}
        >
            <div className={SidebarClasses.fixed}>{children}</div>
        </StyledDrawer>
    );
};

export interface SidebarProps extends DrawerProps {
    appBarAlwaysOn?: boolean;
    children: ReactElement;
    closedSize?: number;
    size?: number;
}

const PREFIX = 'RaSidebar';

export const SidebarClasses = {
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
    appBarCollapsed: `${PREFIX}-appBarCollapsed`,
};

const StyledDrawer = styled(Drawer, {
    name: PREFIX,
    slot: 'Root',
    overridesResolver: (props, styles) => styles.root,
    shouldForwardProp: () => true,
})(({ open, theme }) => ({
    height: 'calc(100vh - 3em)',
    marginTop: 0,
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    [`&.${SidebarClasses.appBarCollapsed}`]: {
        // compensate the margin of the Layout appFrame instead of removing it in the Layout
        // because otherwise, the appFrame content without margin may revert the scrollTrigger,
        // leading to a visual jiggle
        marginTop: theme.spacing(-6),
        [theme.breakpoints.down('sm')]: {
            marginTop: theme.spacing(-7),
        },
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
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
