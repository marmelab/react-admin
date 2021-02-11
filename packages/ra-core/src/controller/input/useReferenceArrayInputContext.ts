import { useContext } from 'react';
import {
    ReferenceArrayInputContext,
    ReferenceArrayInputContextValue,
} from './ReferenceArrayInputContext';

/**
 * Hook to get the ReferenceArrayInputContext.
 */
export const useReferenceArrayInputContext = <
    T extends ReferenceArrayInputContextValue = ReferenceArrayInputContextValue
>(
    props: T
): ReferenceArrayInputContextValue => {
    const context = useContext(ReferenceArrayInputContext);

    if (props.choices) {
        return props;
    }

    return context;
};
