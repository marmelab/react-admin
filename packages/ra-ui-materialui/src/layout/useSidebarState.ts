import { useStore } from 'ra-core';
import { useMediaQuery, Theme } from '@mui/material';

/**
 * A hook that returns the sidebar open state and a function to toggle it.
 *
 * The sidebar is open by default on desktop, and closed by default on mobile.
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
export const useSidebarState = (): useSidebarStateResult => {
    const isXSmall = useMediaQuery<Theme>(
        theme => theme?.breakpoints.down('sm'),
        { noSsr: true }
    );
    return useStore<boolean>('sidebar.open', isXSmall ? false : true);
};

export type useSidebarStateResult = [boolean, (open: boolean) => void];
