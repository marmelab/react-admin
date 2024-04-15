import { ReactNode } from 'react';
import { useRestoreScrollPosition } from './useRestoreScrollPosition';

/**
 * A component that tracks the scroll position and restores it when the component mounts.
 * @param children The content to render
 * @param key The key under which to store the scroll position in the store
 * @param debounceMs The debounce time in milliseconds
 *
 * @example
 * import { ListBase, RestoreScrollPosition } from 'ra-core';
 *
 * const MyCustomList = (props) => (
 *   <RestoreScrollPosition key="my-list>
 *     <ListBase {...props} />
 *   </RestoreScrollPosition>
 * };
 */
export const RestoreScrollPosition = ({
    children,
    storeKey,
    debounce = 250,
}: {
    storeKey: string;
    debounce?: number;
    children: ReactNode;
}) => {
    useRestoreScrollPosition(storeKey, debounce);
    return children;
};
