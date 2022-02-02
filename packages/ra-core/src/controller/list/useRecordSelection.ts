import { useMemo } from 'react';

import { useStore, useRemoveFromStore } from '../../store';
import { Identifier } from '../../types';

/**
 * Get the list of selected items for a resource, and callbacks to change the selection
 *
 * @param resource The resource name, e.g. 'posts'
 *
 * @returns {Object} Destructure as [selectedIds, { select, toggle, clearSelection }].
 */
export const useRecordSelection = (
    resource: string
): [
    Identifier[],
    {
        select: (ids: Identifier[]) => void;
        unselect: (ids: Identifier[]) => void;
        toggle: (id: Identifier) => void;
        clearSelection: () => void;
    }
] => {
    const storeKey = `${resource}.selectedIds`;
    const [ids, setIds] = useStore(storeKey, defaultSelection);
    const reset = useRemoveFromStore(storeKey);

    const selectionModifiers = useMemo(
        () => ({
            select: (idsToAdd: Identifier[]) => {
                if (!idsToAdd) return;
                setIds([...idsToAdd]);
            },
            unselect(idsToRemove: Identifier[]) {
                if (!idsToRemove || idsToRemove.length === 0) return;
                setIds(ids => {
                    if (!Array.isArray(ids)) return [];
                    return ids.filter(id => !idsToRemove.includes(id));
                });
            },
            toggle: (id: Identifier) => {
                if (typeof id === 'undefined') return;
                setIds(ids => {
                    if (!Array.isArray(ids)) return [...ids];
                    const index = ids.indexOf(id);
                    return index > -1
                        ? [...ids.slice(0, index), ...ids.slice(index + 1)]
                        : [...ids, id];
                });
            },
            clearSelection: () => {
                reset();
            },
        }),
        [setIds, reset]
    );

    return [ids, selectionModifiers];
};

const defaultSelection = [];
