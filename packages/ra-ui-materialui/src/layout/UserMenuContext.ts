import { createContext } from 'react';

/**
 * This context provides access to a function for closing the user menu.
 *
 * @example
 * import { Logout, MenuItemLink, UserMenu, useUserMenu } from 'react-admin';
 *
 * const ConfigurationMenu = () => {
 *     const { onClose } = useUserMenu();
 *     return (
 *         <MenuItemLink
 *             to="/configuration"
 *             primaryText="pos.configuration"
 *             leftIcon={<SettingsIcon />}
 *             sidebarIsOpen
 *             onClick={onClose}
 *         />
 *     );
 * };
 *
 * export const MyUserMenu = () => (
 *     <UserMenu>
 *         <ConfigurationMenu />
 *         <Logout />
 *     </UserMenu>
 * );
 */
export const UserMenuContext = createContext<UserMenuContextValue>(undefined);

export type UserMenuContextValue = {
    /**
     * Closes the user menu
     * @see UserMenu
     */
    onClose: () => void;
};
