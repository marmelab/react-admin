import { createContext, useContext } from 'react';

export const HasDashboardContext = createContext<boolean>(false);

export const HasDashboardContextProvider = HasDashboardContext.Provider;

/**
 * Returns true if the app has a dashboard defined at the <Admin> level.
 *
 * @private
 * @example
 * import { useHasDashboard } from 'react-admin';
 *
 * const MyMenu = () => {
 *    const hasDashboard = useHasDashboard();
 *    return (
 *       <Menu>
 *          {hasDashboard && <DashboardMenuItem />}
 *          <MenuItemLink to="/posts" />
 *          <MenuItemLink to="/comments" />
 *       </Menu>
 *     );
 * }
 */
export const useHasDashboard = () => useContext(HasDashboardContext);
