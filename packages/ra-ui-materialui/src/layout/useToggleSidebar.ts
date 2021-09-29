import { useDispatch, useSelector } from 'react-redux';
import { ReduxState, toggleSidebar } from 'ra-core';

/**
 * A hook that returns the sidebar open state and a function to toggle it.
 * @returns A tuple containing a boolean indicating whether the sidebar is open or not and a function to toggle the sidebar.
 * @example
 * const MyButton = () => {
 *     const [sidebarOpen, toggleSidebar] = useToggleSidebar();
 *     return (
 *         <Button
 *             color="inherit"
 *             onClick={() => toggleSidebar()}
 *         >
 *             {open ? 'Open' : 'Close'}
 *         </Button>
 *     );
 */
export const useToggleSidebar = (): UseToggleSidebarResult => {
    const open = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );
    const dispatch = useDispatch();

    const toggle = () => dispatch(toggleSidebar());
    return [open, toggle];
};

export type UseToggleSidebarResult = [boolean, () => void];
