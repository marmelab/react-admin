import { SetStateAction, useMemo, useState } from 'react';

import { useStore } from '../../store';
import { RaRecord } from '../../types';

type UseRecordSelectionWithResourceArgs = {
    resource: string;
    namespace?: string;
    disableSyncWithStore?: false;
};
type UseRecordSelectionWithNoStoreArgs = {
    resource?: string;
    namespace?: string;
    disableSyncWithStore: true;
};

export type UseRecordSelectionArgs =
    | UseRecordSelectionWithResourceArgs
    | UseRecordSelectionWithNoStoreArgs;

export type UseRecordSelectionResult<RecordType extends RaRecord = any> = [
    RecordType['id'][],
    {
        select: (ids: RecordType['id'][]) => void;
        unselect: (
            ids: RecordType['id'][],
            fromAllNamespaces?: boolean
        ) => void;
        toggle: (id: RecordType['id']) => void;
        clearSelection: () => void;
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
 * @param args.disableSyncWithStore Controls the selection syncronization with the store
 *
 * @returns {Object} Destructure as [selectedIds, { select, toggle, clearSelection }].
 */
export const useRecordSelection = <RecordType extends RaRecord = any>(
    args: UseRecordSelectionArgs
): UseRecordSelectionResult<RecordType> => {
    const {
        resource = '',
        disableSyncWithStore = false,
        namespace = defaultNamespace,
    } = args;

    const storeKeyNoNamespace = `${resource}.selectedIds`;
    const storeKey = `${storeKeyNoNamespace}.namespaced`;

    const [localSelectionStore, setLocalSelectionStore] =
        useState<SelectionStore<RecordType>>(defaultSelection);
    // As we can't conditionally call a hook, if the storeKey is false,
    // we'll ignore the params variable later on and won't call setParams either.
    const [selectionStore, setSelectionStore] = useStore<
        SelectionStore<RecordType>
    >(storeKey, defaultSelection);

    const [selectionStoreNoNamespace, setSelectionStoreNoNamespace] = useStore<
        RecordType['id'][]
    >(storeKeyNoNamespace, []);

    const ids =
        (disableSyncWithStore
            ? localSelectionStore[namespace]
            : namespace === defaultNamespace
              ? selectionStoreNoNamespace
              : selectionStore[namespace]) ?? defaultEmptyIds;

    const setStore = useMemo(
        () =>
            disableSyncWithStore
                ? setLocalSelectionStore
                : ((storeOrSetStateAction => {
                      if (typeof storeOrSetStateAction === 'function') {
                          const setStateAction = storeOrSetStateAction;

                          setSelectionStore(setStateAction);
                          setSelectionStoreNoNamespace(
                              ids =>
                                  setStateAction({ [defaultNamespace]: ids })?.[
                                      defaultNamespace
                                  ]
                          );
                      } else {
                          const store = storeOrSetStateAction;
                          setSelectionStore(store);
                          setSelectionStoreNoNamespace(store[defaultNamespace]);
                      }
                  }) as React.Dispatch<
                      SetStateAction<SelectionStore<RecordType>>
                  >),
        [disableSyncWithStore, setSelectionStore, setSelectionStoreNoNamespace]
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
                fromAllNamespaces?: boolean
            ) {
                if (!idsToRemove || idsToRemove.length === 0) return;
                setStore(store => {
                    if (!fromAllNamespaces) {
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
                    const ids = store[namespace];

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
            clearSelection: () => {
                setStore(store => {
                    return {
                        ...store,
                        [namespace]: [],
                    };
                });
            },
        }),
        [setStore, namespace]
    );

    return [ids, selectionModifiers];
};

const defaultNamespace = '';
const defaultSelection = {};
const defaultEmptyIds = [];
