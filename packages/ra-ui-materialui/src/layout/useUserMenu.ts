import { useContext } from 'react';
import { UserMenuContext } from './UserMenuContext';

/**
 * A hook to retrieve the user menu context, which provides access to a function for closing the user menu.
 * @returns {UserMenuContextValue}
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
export const useUserMenu = () => useContext(UserMenuContext);
