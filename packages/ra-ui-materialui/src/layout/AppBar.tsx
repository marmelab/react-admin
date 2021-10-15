import * as React from 'react';
import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Children, cloneElement, memo } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Toolbar,
    Typography,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { ComponentPropType } from 'ra-core';

import { SidebarToggleButton } from './SidebarToggleButton';
import { LoadingIndicator } from './LoadingIndicator';
import { UserMenu } from './UserMenu';
import { HideOnScroll } from './HideOnScroll';

/**
 * The AppBar component renders a custom MuiAppBar.
 *
 * @param {Object} props
 * @param {ReactNode} props.children React node/s to be render as children of the AppBar
 * @param {Object} props.classes CSS class names
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.color The color of the AppBar
 * @param {Component} props.logout The logout button component that will be pass to the UserMenu component
 * @param {boolean} props.open State of the <Admin/> Sidebar
 * @param {Element | boolean} props.userMenu A custom user menu component for the AppBar. <UserMenu/> component by default. Pass false to disable.
 *
 * @example
 *
 * const MyAppBar = props => {

 *   return (
 *       <AppBar {...props}>
 *           <Typography
 *               variant="h6"
 *               color="inherit"
 *               className={classes.title}
 *               id="react-admin-title"
 *           />
 *       </AppBar>
 *   );
 *};
 *
 * @example Without a user menu
 *
 * const MyAppBar = props => {

 *   return (
 *       <AppBar {...props} userMenu={false} />
 *   );
 *};
 */
export const AppBar: FC<AppBarProps> = memo(props => {
    const {
        children,
        className,
        color = 'secondary',
        logout,
        open,
        title,
        userMenu = DefaultUserMenu,
        container: Container = HideOnScroll,
        ...rest
    } = props;

    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );

    return (
        <Container>
            <StyledAppBar className={className} color={color} {...rest}>
                <Toolbar
                    disableGutters
                    variant={isXSmall ? 'regular' : 'dense'}
                    className={AppBarClasses.toolbar}
                >
                    <SidebarToggleButton className={AppBarClasses.menuButton} />
                    {Children.count(children) === 0 ? (
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={AppBarClasses.title}
                            id="react-admin-title"
                        />
                    ) : (
                        children
                    )}
                    <LoadingIndicator />
                    {typeof userMenu === 'boolean' ? (
                        userMenu === true ? (
                            <UserMenu logout={logout} />
                        ) : null
                    ) : (
                        cloneElement(userMenu, { logout })
                    )}
                </Toolbar>
            </StyledAppBar>
        </Container>
    );
});

AppBar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
    ]),
    container: ComponentPropType,
    logout: PropTypes.element,
    // @deprecated
    open: PropTypes.bool,
    userMenu: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};

const DefaultUserMenu = <UserMenu />;

export interface AppBarProps extends Omit<MuiAppBarProps, 'title'> {
    container?: React.ElementType<any>;
    logout?: React.ReactNode;
    // @deprecated
    open?: boolean;
    title?: string | JSX.Element;
    userMenu?: JSX.Element | boolean;
}

const PREFIX = 'RaAppBar';

export const AppBarClasses = {
    toolbar: `${PREFIX}-toolbar`,
    menuButton: `${PREFIX}-menuButton`,
    menuButtonIconClosed: `${PREFIX}-menuButtonIconClosed`,
    menuButtonIconOpen: `${PREFIX}-menuButtonIconOpen`,
    title: `${PREFIX}-title`,
};

const StyledAppBar = styled(MuiAppBar, { name: PREFIX })(({ theme }) => ({
    [`& .${AppBarClasses.toolbar}`]: {
        paddingRight: 24,
    },

    [`& .${AppBarClasses.menuButton}`]: {
        marginLeft: '0.2em',
        marginRight: '0.2em',
    },

    [`& .${AppBarClasses.title}`]: {
        flex: 1,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
}));
