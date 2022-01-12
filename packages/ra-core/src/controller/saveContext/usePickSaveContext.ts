import { useMemo } from 'react';
import pick from 'lodash/pick';
import { SaveContextValue } from './SaveContext';

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
