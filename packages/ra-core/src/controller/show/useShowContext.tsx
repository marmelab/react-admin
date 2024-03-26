import { useContext, useMemo } from 'react';
import defaults from 'lodash/defaults';

import { RaRecord } from '../../types';
import { ShowContext } from './ShowContext';
import { ShowControllerResult } from './useShowController';

/**
 * Hook to read the show controller props from the ShowContext.
 *
 * Mostly used within a <ShowContext.Provider> (e.g. as a descendent of <Show>).
 *
 * But you can also use it without a <ShowContext.Provider>. In this case, it is up to you
 * to pass all the necessary props.
 *
 * The given props will take precedence over context values.
 *
 * @typedef {Object} ShowControllerResult
 *
 * @returns {ShowControllerResult} create controller props
 *
 * @see useShowController for how it is filled
 *
 */
export const useShowContext = <RecordType extends RaRecord = any>(
    props?: any
): ShowControllerResult<RecordType> => {
    const context = useContext(ShowContext);
    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractShowContextProps<RecordType>(props) : {},
                context
            ),
        [context, props]
    );
};

/**
 * Extract only the show controller props
 *
 * @param {Object} props props passed to the useShowContext hook
 *
 * @returns {ShowControllerResult} show controller props
 */
const extractShowContextProps = <RecordType extends RaRecord = any>({
    record,
    defaultTitle,
    isFetching,
    isLoading,
    isPending,
    resource,
}: Partial<ShowControllerResult<RecordType>>) => ({
    record,
    defaultTitle,
    isFetching,
    isLoading,
    isPending,
    resource,
});
