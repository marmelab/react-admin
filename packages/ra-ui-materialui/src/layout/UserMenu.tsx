import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Children, cloneElement, isValidElement, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslate, useGetIdentity } from 'ra-core';
import {
    Tooltip,
    IconButton,
    Menu,
    Button,
    Avatar,
    PopoverOrigin,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

export const UserMenu = (props: UserMenuProps) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const { loaded, identity } = useGetIdentity();

    const {
        children,
        label = 'ra.auth.user_menu',
        icon = defaultIcon,
        logout,
    } = props;

    if (!logout && !children) return null;
    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <Root className={UserMenuClasses.root}>
            {loaded && identity?.fullName ? (
                <Button
                    aria-label={label && translate(label, { _: label })}
                    className={UserMenuClasses.userButton}
                    color="inherit"
                    startIcon={
                        identity.avatar ? (
                            <Avatar
                                className={UserMenuClasses.avatar}
                                src={identity.avatar}
                                alt={identity.fullName}
                            />
                        ) : (
                            icon
                        )
                    }
                    onClick={handleMenu}
                >
                    {identity.fullName}
                </Button>
            ) : (
                <Tooltip title={label && translate(label, { _: label })}>
                    <IconButton
                        aria-label={label && translate(label, { _: label })}
                        aria-owns={open ? 'menu-appbar' : null}
                        aria-haspopup={true}
                        color="inherit"
                        onClick={handleMenu}
                        size="large"
                    >
                        {icon}
                    </IconButton>
                </Tooltip>
            )}
            <Menu
                id="menu-appbar"
                disableScrollLock
                anchorEl={anchorEl}
                anchorOrigin={AnchorOrigin}
                transformOrigin={TransformOrigin}
                open={open}
                onClose={handleClose}
            >
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement<any>(menuItem, {
                              onClick: handleClose,
                          })
                        : null
                )}
                {logout}
            </Menu>
        </Root>
    );
};

UserMenu.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    label: PropTypes.string,
    logout: PropTypes.element,
    icon: PropTypes.node,
};

export interface UserMenuProps {
    children?: React.ReactNode;

    label?: string;
    logout?: React.ReactNode;
    icon?: React.ReactNode;
}

const PREFIX = 'RaUserMenu';

export const UserMenuClasses = {
    root: `${PREFIX}-root`,
    userButton: `${PREFIX}-userButton`,
    avatar: `${PREFIX}-avatar`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => [
        {
            [`& .${UserMenuClasses.userButton}`]: styles.userButton,
        },
        {
            [`& .${UserMenuClasses.avatar}`]: styles.avatar,
        },
    ],
})(({ theme }) => ({
    [`& .${UserMenuClasses.userButton}`]: {
        textTransform: 'none',
    },

    [`& .${UserMenuClasses.avatar}`]: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

const defaultIcon = <AccountCircle />;

const AnchorOrigin: PopoverOrigin = {
    vertical: 'bottom',
    horizontal: 'right',
};

const TransformOrigin: PopoverOrigin = {
    vertical: 'top',
    horizontal: 'right',
};
