import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';
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
    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null
                    ? extractReferenceArrayInputContextProps(props)
                    : {},
                context
            ),
        [context, props]
    );
};

const extractReferenceArrayInputContextProps = <
    T extends ReferenceArrayInputContextValue = ReferenceArrayInputContextValue
>({
    choices,
    error,
    loaded,
    loading,
    setFilter,
    setPagination,
    setSort,
    setSortForList,
    warning,
}: T) => ({
    choices,
    error,
    loaded,
    loading,
    setFilter,
    setPagination,
    setSort,
    setSortForList,
    warning,
});
