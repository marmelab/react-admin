import React, {
    Children,
    cloneElement,
    FC,
    isValidElement,
    useState,
    ReactElement,
    ReactNode,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslate } from 'ra-core';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

export interface UserMenuProps {
    label?: string;
    icon?: ReactNode;
    logout?: ReactElement;
    children?: ReactNode;
}

const UserMenu: FC<UserMenuProps> = ({ children, label, icon, logout }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const translate = useTranslate();

    if (!logout && !children) return null;
    const open = Boolean(anchorEl);

    const handleMenu = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <div>
            <Tooltip title={label && translate(label, { _: label })}>
                <IconButton
                    aria-label={label && translate(label, { _: label })}
                    aria-owns={open ? 'menu-appbar' : null}
                    aria-haspopup={true}
                    color="inherit"
                    onClick={handleMenu}
                >
                    {icon}
                </IconButton>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                {Children.map(children, menuItem =>
                    isValidElement(menuItem)
                        ? cloneElement(menuItem, {
                              onClick: handleClose,
                          })
                        : null
                )}
                {logout}
            </Menu>
        </div>
    );
};

UserMenu.propTypes = {
    children: PropTypes.node,
    label: PropTypes.string.isRequired,
    logout: PropTypes.element,
    icon: PropTypes.node,
};

UserMenu.defaultProps = {
    label: 'ra.auth.user_menu',
    icon: <AccountCircle />,
};

export default UserMenu;
