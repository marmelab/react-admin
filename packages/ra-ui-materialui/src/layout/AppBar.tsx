import React, { Children, cloneElement, FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import MuiAppBar, {
    AppBarProps as MuiAppBarProps,
} from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Theme } from '@material-ui/core/styles';
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

const AppBar: FC<AppBarProps> = ({
    children,
    classes: classesOverride,
    className,
    logout,
    open,
    title,
    userMenu,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const dispatch = useDispatch();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );

    return (
        <HideOnScroll>
            <MuiAppBar className={className} color="secondary" {...rest}>
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

interface Props {
    logout?: ReactElement;
    userMenu?: ReactElement;
    open?: boolean;
}

export type AppBarProps = Props & MuiAppBarProps;

AppBar.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    logout: PropTypes.element,
    open: PropTypes.bool,
    userMenu: PropTypes.element,
};

AppBar.defaultProps = {
    userMenu: <DefaultUserMenu />,
};

export default AppBar;
