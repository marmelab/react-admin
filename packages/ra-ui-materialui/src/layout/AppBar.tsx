import * as React from 'react';
import { Children, cloneElement, Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import {
    AppBar as MuiAppBar,
    IconButton,
    Toolbar,
    Tooltip,
    Typography,
    useMediaQuery,
    Theme,
} from '@material-ui/core';
import { AppBarProps as MuiAppBarProps } from '@material-ui/core/AppBar';

import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { toggleSidebar, useTranslate } from 'ra-core';

import LoadingIndicator from './LoadingIndicator';
import DefaultUserMenu from './UserMenu';
import HideOnScroll from './HideOnScroll';
import { ClassesOverride } from '../types';

const useStyles = makeStyles(
    theme => ({
        toolbar: {
            paddingRight: 24,
        },
        menuButton: {
            marginLeft: '0.5em',
            marginRight: '0.5em',
        },
        menuButtonIconClosed: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(0deg)',
        },
        menuButtonIconOpen: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(180deg)',
        },
        title: {
            flex: 1,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
    }),
    { name: 'RaAppBar' }
);

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
 *   const classes = useStyles();
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
 *   const classes = useStyles();
 *   return (
 *       <AppBar {...props} userMenu={false} />
 *   );
 *};
 */
const AppBar = (props: AppBarProps): JSX.Element => {
    const {
        children,
        classes: classesOverride,
        className,
        color = 'secondary',
        logout,
        open,
        title,
        userMenu,
        hideOnScroll,
        ...rest
    } = props;
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    const translate = useTranslate();
    const Container = hideOnScroll ? HideOnScroll : Fragment;

    return (
        <Container>
            <MuiAppBar className={className} color={color} {...rest}>
                <Toolbar
                    disableGutters
                    variant={isXSmall ? 'regular' : 'dense'}
                    className={classes.toolbar}
                >
                    <Tooltip
                        title={translate(
                            open
                                ? 'ra.action.close_menu'
                                : 'ra.action.open_menu',
                            {
                                _: 'Open/Close menu',
                            }
                        )}
                        enterDelay={500}
                    >
                        <IconButton
                            color="inherit"
                            onClick={() => dispatch(toggleSidebar())}
                            className={classNames(classes.menuButton)}
                        >
                            <MenuIcon
                                classes={{
                                    root: open
                                        ? classes.menuButtonIconOpen
                                        : classes.menuButtonIconClosed,
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                    {Children.count(children) === 0 ? (
                        <Typography
                            variant="h6"
                            color="inherit"
                            className={classes.title}
                            id="react-admin-title"
                        />
                    ) : (
                        children
                    )}
                    <LoadingIndicator />
                    {typeof userMenu === 'boolean'
                        ? userMenu === true
                            ? cloneElement(<DefaultUserMenu />, { logout })
                            : null
                        : cloneElement(userMenu, { logout })}
                </Toolbar>
            </MuiAppBar>
        </Container>
    );
};

AppBar.propTypes = {
    children: PropTypes.node,
    // @ts-ignore
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
    ]),
    hideOnScroll: PropTypes.bool,
    logout: PropTypes.element,
    open: PropTypes.bool,
    userMenu: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};

AppBar.defaultProps = {
    userMenu: <DefaultUserMenu />,
    hideOnScroll: true,
};

export interface AppBarProps extends Omit<MuiAppBarProps, 'title' | 'classes'> {
    classes?: ClassesOverride<typeof useStyles>;
    hideOnScroll?: boolean;
    logout?: React.ReactNode;
    open?: boolean;
    title?: string | JSX.Element;
    userMenu?: JSX.Element | boolean;
}

export default memo(AppBar);
