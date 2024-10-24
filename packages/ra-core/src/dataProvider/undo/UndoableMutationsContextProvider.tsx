import * as React from 'react';
import { useState, useCallback } from 'react';

import { AddUndoableMutationContext } from './AddUndoableMutationContext';
import { TakeUndoableMutationContext } from './TakeUndoableMutationContext';
import type { UndoableMutation } from './types';

/**
 * Exposes and manages a queue of undoable mutations
 *
 * This context is used in CoreAdminContext so that every react-admin app
 * can use the useAddUndoableMutation and useTakeUndoableMutation hooks.
 *
 * Note: We need a separate queue for mutations (instead of using the
 * notifications queue) because the mutations are not dequeued when the
 * notification is displayed, but when it is dismissed.
 */
export const UndoableMutationsContextProvider = ({ children }) => {
    const [mutations, setMutations] = useState<UndoableMutation[]>([]);

    /**
     * Add a new mutation (pushes a new mutation to the queue).
     *
     * Used by optimistic data provider hooks, e.g., useDelete
     */
    const addMutation = useCallback((mutation: UndoableMutation) => {
        setMutations(mutations => [...mutations, mutation]);
    }, []);

    /**
     * Get the next mutation to execute (shifts the first mutation from the queue) and returns it.
     *
     * Used by the Notification component to process or undo the mutation
     */
    const takeMutation = useCallback(() => {
        if (mutations.length === 0) return;
        const [mutation, ...rest] = mutations;
        setMutations(rest);
        return mutation;
    }, [mutations]);

    return (
        <TakeUndoableMutationContext.Provider value={takeMutation}>
            <AddUndoableMutationContext.Provider value={addMutation}>
                {children}
            </AddUndoableMutationContext.Provider>
        </TakeUndoableMutationContext.Provider>
    );
};
