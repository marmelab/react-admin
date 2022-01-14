import { useMemo } from 'react';
import pick from 'lodash/pick';
import { SaveContextValue } from './SaveContext';

/**
 * This hook extracts the `save` and `saving` properties from either the `CreateContext` or `EditContext`. This ensures the `SaveContext` doesn't rerender when those two contexts have other properties changes.
 */
export const usePickSaveContext = <
    ContextType extends SaveContextValue = SaveContextValue
>(
    context: ContextType
): SaveContextValue => {
    const value = useMemo(
        () => pick(context, ['save', 'saving']),
        /* eslint-disable react-hooks/exhaustive-deps */
        [context.save, context.saving]
        /* eslint-enable react-hooks/exhaustive-deps */
    );

    return value;
};
