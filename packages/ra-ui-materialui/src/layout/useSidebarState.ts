import { usePreference } from 'ra-core';

/**
 * A hook that returns the sidebar open state and a function to toggle it.
 *
 * @example
 * const ToggleSidebar = () => {
 *     const [open, setOpen] = useSidebarState();
 *     return (
 *         <Button onClick={() => setOpen(!open)}>
 *             {open ? 'Open' : 'Close'}
 *         </Button>
 *     );
 * };
 */
export const useSidebarState = (): useSidebarStateResult =>
    usePreference('sidebar.open', true);

export type useSidebarStateResult = [boolean, (open: boolean) => void];
