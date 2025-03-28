import { useMemo } from 'react';
import pick from 'lodash/pick';
import { SaveContextValue } from './SaveContext';

/**
 * This hook extracts the `save`, `saving` and mutationMode properties from either the `CreateContext` or `EditContext`. This ensures the `SaveContext` doesn't rerender when those two contexts have other properties changes.
 */
export const usePickSaveContext = <
    ContextType extends SaveContextValue = SaveContextValue,
>(
    context: ContextType
): SaveContextValue => {
    const value = useMemo(
        () =>
            pick(context, [
                'save',
                'saving',
                'mutationMode',
                'registerMutationMiddleware',
                'unregisterMutationMiddleware',
            ]),
        /* eslint-disable react-hooks/exhaustive-deps */
        [
            context.save,
            context.saving,
            context.mutationMode,
            context.registerMutationMiddleware,
            context.unregisterMutationMiddleware,
        ]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return value;
};
