import * as React from 'react';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useAuthProvider, useGetIdentity, useTranslate } from 'ra-core';
import {
    Tooltip,
    IconButton,
    Menu,
    Button,
    Avatar,
    PopoverOrigin,
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { UserMenuContextProvider } from './UserMenuContextProvider';
import { Logout } from '../auth/Logout';

/**
 * The UserMenu component renders a Mui Button that shows a Menu.
 * It accepts children that must be Mui MenuItem components.
 *
 * @example
 * import { Logout, UserMenu, useUserMenu } from 'react-admin';
 * import MenuItem from '@mui/material/MenuItem';
 * import ListItemIcon from '@mui/material/ListItemIcon';
 * import ListItemText from '@mui/material/ListItemText';
 * import SettingsIcon from '@mui/icons-material/Settings';

 * const ConfigurationMenu = React.forwardRef((props, ref) => {
 *     const { onClose } = useUserMenu();
 *     return (
 *         <MenuItem
 *             ref={ref}
 *             {...props}
 *             to="/configuration"
 *             onClick={onClose}
 *         >
 *             <ListItemIcon>
 *                 <SettingsIcon />
 *             </ListItemIcon>
 *             <ListItemText>Configuration</ListItemText>
 *         </MenuItem>
 *     );
 * });
 *
 * export const MyUserMenu = () => (
 *     <UserMenu>
 *         <ConfigurationMenu />
 *         <Logout />
 *     </UserMenu>
 * );
 * @param props
 * @param {ReactNode} props.children React node/s to be rendered as children of the UserMenu. Must be Mui MenuItem components
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.label The label of the UserMenu button. Accepts translation keys
 * @param {Element} props.icon The icon of the UserMenu button.
 *
 */
export const UserMenu = (props: UserMenuProps) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();
    const { loaded, identity } = useGetIdentity();
    const authProvider = useAuthProvider();

    const {
        children = !!authProvider ? <Logout /> : null,
        className,
        label = 'ra.auth.user_menu',
        icon = defaultIcon,
    } = props;

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = useCallback(() => setAnchorEl(null), []);
    const context = useMemo(() => ({ onClose: handleClose }), [handleClose]);
    if (!children) return null;
    const open = Boolean(anchorEl);

    return (
        <Root className={className}>
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
            <UserMenuContextProvider value={context}>
                <Menu
                    id="menu-appbar"
                    disableScrollLock
                    anchorEl={anchorEl}
                    anchorOrigin={AnchorOrigin}
                    transformOrigin={TransformOrigin}
                    open={open}
                    onClose={handleClose}
                >
                    {children}
                </Menu>
            </UserMenuContextProvider>
        </Root>
    );
};

UserMenu.propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
    label: PropTypes.string,
    icon: PropTypes.node,
};

export interface UserMenuProps {
    children?: ReactNode;
    className?: string;
    label?: string;
    icon?: ReactNode;
}

const PREFIX = 'RaUserMenu';

export const UserMenuClasses = {
    userButton: `${PREFIX}-userButton`,
    avatar: `${PREFIX}-avatar`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
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
