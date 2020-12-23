import { useCallback, useEffect, useRef } from 'react';

import { useSafeSetState } from '../util';
import { Identifier } from '../types';

const defaultSelection = [];

export interface SelectionState {
    selectedIds: Identifier[];
    onSelect: (ids: Identifier[]) => void;
    onToggleItem: (id: Identifier) => void;
    onUnselectItems: () => void;
}

/**
 * Hooks to provide selection state.
 *
 * The names of the return values match the ListContext interface
 *
 * @example
 *
 * const { selectedIds, onSelect, onToggleItem, onUnselectItems } = useSelectionState();
 *
 */
const useSelectionState = (
    initialSelection = defaultSelection
): SelectionState => {
    const [selectedIds, setSelectedIds] = useSafeSetState<Identifier[]>(
        initialSelection
    );

    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setSelectedIds(initialSelection);
    }, [initialSelection, setSelectedIds]);

    const onSelect = useCallback(
        (newIds: Identifier[]) => {
            setSelectedIds(newIds);
        },
        [setSelectedIds]
    );
    const onToggleItem = useCallback(
        (id: Identifier) => {
            setSelectedIds(previousState => {
                const index = previousState.indexOf(id);
                if (index > -1) {
                    return [
                        ...previousState.slice(0, index),
                        ...previousState.slice(index + 1),
                    ];
                } else {
                    return [...previousState, id];
                }
            });
        },
        [setSelectedIds]
    );
    const onUnselectItems = useCallback(() => {
        setSelectedIds([]);
    }, [setSelectedIds]);

    return {
        selectedIds,
        onSelect,
        onToggleItem,
        onUnselectItems,
    };
};

export default useSelectionState;
