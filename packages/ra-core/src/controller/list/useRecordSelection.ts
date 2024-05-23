import { useCallback, useMemo, useState } from 'react';

import { useStore, useRemoveFromStore } from '../../store';
import { RaRecord } from '../../types';

type UseRecordSelectionWithResourceArgs = {
    resource: string;
    disableSyncWithStore?: false;
};
type UseRecordSelectionWithNoStoreArgs = {
    resource?: string;
    disableSyncWithStore: true;
};

export type UseRecordSelectionArgs =
    | UseRecordSelectionWithResourceArgs
    | UseRecordSelectionWithNoStoreArgs;

export type UseRecordSelectionResult<RecordType extends RaRecord = any> = [
    RecordType['id'][],
    {
        select: (ids: RecordType['id'][]) => void;
        unselect: (ids: RecordType['id'][]) => void;
        toggle: (id: RecordType['id']) => void;
        clearSelection: () => void;
    },
];

/**
 * Get the list of selected items for a resource, and callbacks to change the selection
 *
 * @param args.resource The resource name, e.g. 'posts'
 * @param args.disableSyncWithStore Controls the selection syncronization with the store
 *
 * @returns {Object} Destructure as [selectedIds, { select, toggle, clearSelection }].
 */
export const useRecordSelection = <RecordType extends RaRecord = any>(
    args: UseRecordSelectionArgs
): UseRecordSelectionResult<RecordType> => {
    const { resource = '', disableSyncWithStore = false } = args;

    const storeKey = `${resource}.selectedIds`;

    const [localIds, setLocalIds] =
        useState<RecordType['id'][]>(defaultSelection);
    // As we can't conditionally call a hook, if the storeKey is false,
    // we'll ignore the params variable later on and won't call setParams either.
    const [storeIds, setStoreIds] = useStore<RecordType['id'][]>(
        storeKey,
        defaultSelection
    );
    const resetStore = useRemoveFromStore(storeKey);

    const ids = disableSyncWithStore ? localIds : storeIds;
    const setIds = disableSyncWithStore ? setLocalIds : setStoreIds;

    const reset = useCallback(() => {
        if (disableSyncWithStore) {
            setLocalIds(defaultSelection);
        } else {
            resetStore();
        }
    }, [disableSyncWithStore, resetStore]);

    const selectionModifiers = useMemo(
        () => ({
            select: (idsToAdd: RecordType['id'][]) => {
                if (!idsToAdd) return;
                setIds([...idsToAdd]);
            },
            unselect(idsToRemove: RecordType['id'][]) {
                if (!idsToRemove || idsToRemove.length === 0) return;
                setIds(ids => {
                    if (!Array.isArray(ids)) return [];
                    return ids.filter(id => !idsToRemove.includes(id));
                });
            },
            toggle: (id: RecordType['id']) => {
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
