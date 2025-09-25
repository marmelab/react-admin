import { useMemo, useState } from 'react';

import { useStore } from '../../store';
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

type SelectionStore<RecordType extends RaRecord> = Record<
    string,
    RecordType['id'][]
>;

/**
 * Get the list of selected items for a resource, and callbacks to change the selection
 *
 * @param args.resource The resource name, e.g. 'posts'
 * @param args.storeKey The key to use to store selected items. Pass false to disable synchronization with the store.
 * @param args.disableSyncWithStore Controls the selection synchronization with the store
 *
 * @returns {Object} Destructure as [selectedIds, { select, toggle, clearSelection }].
 */
export const useRecordSelection = <RecordType extends RaRecord = any>(
    args: UseRecordSelectionArgs
): UseRecordSelectionResult<RecordType> => {
    const { resource = '', storeKey, disableSyncWithStore } = args;

    const namespace = storeKey ?? defaultNamespace;

    const finalStoreKey = `${resource}.selectedIds`;

    const [localSelectionStore, setLocalSelectionStore] = useState<
        SelectionStore<RecordType>
    >(defaultSelectionStore);
    // As we can't conditionally call a hook, if the disableSyncWithStore is true,
    // we'll ignore the store value later on and won't call setSelectionStore either.
    const [selectionStoreUnknownVersion, setSelectionStore] = useStore<
        SelectionStore<RecordType>
    >(finalStoreKey, defaultSelectionStore);

    const store = disableSyncWithStore
        ? localSelectionStore
        : migrateSelectionStoreToNewVersion(selectionStoreUnknownVersion);
    const ids = store[namespace] ?? defaultEmptyIds;

    const setStore = useMemo(
        () =>
            disableSyncWithStore
                ? setLocalSelectionStore
                : (function migrateAndSetSelectionStore(valueOrSetter) {
                      if (typeof valueOrSetter === 'function') {
                          setSelectionStore(prevValue =>
                              valueOrSetter(
                                  migrateSelectionStoreToNewVersion(prevValue)
                              )
                          );
                      } else {
                          setSelectionStore(valueOrSetter);
                      }
                  } satisfies typeof setSelectionStore),
        [disableSyncWithStore, setSelectionStore]
    );

    const selectionModifiers = useMemo(
        () => ({
            select: (idsToSelect: RecordType['id'][]) => {
                if (!idsToSelect) return;

                setStore(store => ({
                    ...store,
                    [namespace]: [...idsToSelect],
                }));
            },
            unselect(
                idsToRemove: RecordType['id'][],
                fromAllStoreKeys?: boolean
            ) {
                if (!idsToRemove || idsToRemove.length === 0) return;
                setStore(store => {
                    if (!fromAllStoreKeys) {
                        return {
                            ...store,
                            [namespace]: store[namespace]?.filter(
                                id => !idsToRemove.includes(id)
                            ),
                        };
                    } else {
                        return Object.fromEntries(
                            Object.entries(store).map(([namespace, ids]) => {
                                return [
                                    namespace,
                                    ids?.filter(
                                        id => !idsToRemove.includes(id)
                                    ),
                                ];
                            })
                        );
                    }
                });
            },
            toggle: (id: RecordType['id']) => {
                if (typeof id === 'undefined') return;

                setStore(store => {
                    const ids = store[namespace] ?? defaultEmptyIds;

                    if (!Array.isArray(ids))
                        return { ...store, [namespace]: [...ids] };

                    const index = ids.indexOf(id);
                    const hasId = index > -1;

                    return {
                        ...store,
                        [namespace]: hasId
                            ? [...ids.slice(0, index), ...ids.slice(index + 1)]
                            : [...ids, id],
                    };
                });
            },
            clearSelection: (fromAllStoreKeys?: boolean) => {
                setStore(store => {
                    if (fromAllStoreKeys) {
                        console.log(
                            store,
                            Object.fromEntries(
                                Object.keys(store).map(namespace => [
                                    namespace,
                                    [],
                                ])
                            )
                        );

                        return Object.fromEntries(
                            Object.keys(store).map(namespace => [namespace, []])
                        );
                    } else {
                        return {
                            ...store,
                            [namespace]: [],
                        };
                    }
                });
            },
        }),
        [setStore, namespace]
    );

    return [ids, selectionModifiers];
};

const defaultNamespace = '';
const defaultSelectionStore = {};
const defaultEmptyIds = [];

function migrateSelectionStoreToNewVersion<RecordType extends RaRecord>(
    selectionStoreUnknownVersion: SelectionStore<RecordType>
) {
    return Array.isArray(selectionStoreUnknownVersion)
        ? {
              ...defaultSelectionStore,
              [defaultNamespace]: selectionStoreUnknownVersion,
          }
        : selectionStoreUnknownVersion;
}
