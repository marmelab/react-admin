import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { toggleSidebar } from 'ra-core';

import LoadingIndicator from './LoadingIndicator';
import DefaultUserMenu from './UserMenu';
import HideOnScroll from './HideOnScroll';

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
 * @param {Function} children Must be a function which will be called with the mutate callback
 * @param {Object} classes CSS class names
 * @param {string} className CSS class applied to the MuiAppBar component
 * @param {string} color The color of the AppBar
 * @param {Object} logout The logout button component that will be pass to the UserMenu component
 * @param {boolean} open State of the <Admin/> Sidebar
 * @param {Function} userMenu A custom UserMenu component for the AppBar. UserMenu component by default
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
 *        </AppBar>
 *    );
 *};
 */
const AppBar = ({
    children,
    classes: classesOverride,
    className,
    color = 'secondary',
    logout,
    open,
    userMenu,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));

    return (
        <HideOnScroll>
            <MuiAppBar className={className} color={color} {...rest}>
                <Toolbar
                    disableGutters
                    variant={isXSmall ? 'regular' : 'dense'}
                    className={classes.toolbar}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
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
                    {cloneElement(userMenu, { logout })}
                </Toolbar>
            </MuiAppBar>
        </HideOnScroll>
    );
};

AppBar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    color: PropTypes.oneOf(['primary', 'secondary']),
    logout: PropTypes.element,
    open: PropTypes.bool,
    userMenu: PropTypes.element,
};

AppBar.defaultProps = {
    userMenu: <DefaultUserMenu />,
};

export default AppBar;
