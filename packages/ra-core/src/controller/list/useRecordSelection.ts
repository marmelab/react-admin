import { useEffect, useMemo, useState } from 'react';

import { useStore, useStoreContext } from '../../store';
import { RaRecord } from '../../types';

type UseRecordSelectionWithResourceArgs = {
    resource: string;
    storeKey?: string;
    disableSyncWithStore?: false;
};
type UseRecordSelectionWithNoStoreArgs = {
    resource?: string;
    storeKey?: string;
    disableSyncWithStore: true;
};

export type UseRecordSelectionArgs =
    | UseRecordSelectionWithResourceArgs
    | UseRecordSelectionWithNoStoreArgs;

export type UseRecordSelectionResult<RecordType extends RaRecord = any> = [
    RecordType['id'][],
    {
        select: (ids: RecordType['id'][]) => void;
        unselect: (ids: RecordType['id'][], fromAllStoreKeys?: boolean) => void;
        toggle: (id: RecordType['id']) => void;
        clearSelection: (fromAllStoreKeys?: boolean) => void;
    },
];

/**
 * Get the list of selected items for a resource, and callbacks to change the selection
 *
 * @param args.resource The resource name, e.g. 'posts'
 * @param args.storeKey The key to use to store selected items. Pass false to disable synchronization with the store.
 * @param args.disableSyncWithStore Controls the selection synchronization with the store
 *
 * @returns {Object} Destructure as [selectedIds, { select, unselect, toggle, clearSelection }].
 */
export const useRecordSelection = <RecordType extends RaRecord = any>(
    args: UseRecordSelectionArgs
): UseRecordSelectionResult<RecordType> => {
    const { resource = '', storeKey, disableSyncWithStore } = args;

    const finalStoreKey = `${storeKey || resource}.selectedIds`;

    const [localSelectionStore, setLocalSelectionStore] =
        useState<RecordType['id'][]>(defaultIds);
    // As we can't conditionally call a hook, if the disableSyncWithStore is true,
    // we'll ignore the useStore values later on and won't call set functions either.
    const [selectionStore, setSelectionStore] = useStore<RecordType['id'][]>(
        finalStoreKey,
        defaultIds
    );
    const [storeKeys, setStoreKeys] = useStore<string[]>(
        `${resource}.selectedIds.storeKeys`,
        defaultStoreKeys
    );

    useEffect(
        function addStoreKeyToStore() {
            if (!disableSyncWithStore && storeKey) {
                setStoreKeys(storeKeys => {
                    if (!storeKeys.includes(finalStoreKey)) {
                        return [...storeKeys, finalStoreKey];
                    } else {
                        return storeKeys;
                    }
                });
            }
        },
        [disableSyncWithStore, finalStoreKey, setStoreKeys, storeKey]
    );

    const { getItem, setItem } = useStoreContext();

    const ids = disableSyncWithStore ? localSelectionStore : selectionStore;

    const setStore = useMemo(
        () =>
            disableSyncWithStore ? setLocalSelectionStore : setSelectionStore,
        [disableSyncWithStore, setSelectionStore]
    );

    const selectionModifiers = useMemo(
        () => ({
            select: (idsToSelect: RecordType['id'][]) => {
                if (!idsToSelect) return;

                setStore(idsToSelect);
            },
            unselect(
                idsToRemove: RecordType['id'][],
                fromAllStoreKeys?: boolean
            ) {
                if (!idsToRemove || idsToRemove.length === 0) return;

                setStore(ids => ids.filter(id => !idsToRemove.includes(id)));

                if (!disableSyncWithStore && fromAllStoreKeys) {
                    storeKeys
                        .filter(storeKey => storeKey !== finalStoreKey)
                        .forEach(storeKey => {
                            const ids = getItem<RecordType['id'][]>(storeKey);
                            if (ids) {
                                setItem<RecordType['id'][]>(
                                    storeKey,
                                    ids.filter(id => !idsToRemove.includes(id))
                                );
                            }
                        });
                }
            },
            toggle: (id: RecordType['id']) => {
                if (typeof id === 'undefined') return;

                setStore(ids => {
                    if (!Array.isArray(ids)) return [...ids];

                    const index = ids.indexOf(id);
                    const hasId = index > -1;

                    return hasId
                        ? [...ids.slice(0, index), ...ids.slice(index + 1)]
                        : [...ids, id];
                });
            },
            clearSelection: (fromAllStoreKeys?: boolean) => {
                setStore(defaultIds);

                if (!disableSyncWithStore && fromAllStoreKeys) {
                    storeKeys
                        .filter(storeKey => storeKey !== finalStoreKey)
                        .forEach(storeKey => {
                            const ids = getItem<RecordType['id'][]>(storeKey);
                            if (ids) {
                                setItem<RecordType['id'][]>(
                                    storeKey,
                                    defaultIds
                                );
                            }
                        });
                }
            },
        }),
        [
            disableSyncWithStore,
            finalStoreKey,
            getItem,
            setItem,
            setStore,
            storeKeys,
        ]
    );

    return [ids, selectionModifiers];
};

const defaultIds = [];
const defaultStoreKeys = [];
