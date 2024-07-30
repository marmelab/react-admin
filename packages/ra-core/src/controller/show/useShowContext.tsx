import { useContext } from 'react';

import { RaRecord } from '../../types';
import { ShowContext } from './ShowContext';
import { ShowControllerResult } from './useShowController';

/**
 * Hook to read the show controller props from the ShowContext.
 *
 * Used within a <ShowContextProvider> (e.g. as a descendent of <Show>).
 *
 * @returns {ShowControllerResult} create controller props
 *
 * @see useShowController for how it is filled
 */
export const useShowContext = <
    RecordType extends RaRecord = any,
>(): ShowControllerResult<RecordType> => {
    const context = useContext(ShowContext);
    // Props take precedence over the context
    if (!context) {
        throw new Error(
            'useShowContext must be used inside a ShowContextProvider'
        );
    }
    return context;
};
