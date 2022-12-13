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
    props?: Partial<ShowControllerResult<RecordType>>
): ShowControllerResult<RecordType> => {
    // Can't find a way to specify the RecordType when ShowContext is declared
    // @ts-ignore
    const context = useContext<ShowControllerResult<RecordType>>(ShowContext);

    // Props take precedence over the context
    return useMemo(
        () =>
            defaults(
                {},
                props != null ? extractShowContextProps(props) : {},
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
const extractShowContextProps = ({
    record,
    data,
    defaultTitle,
    isFetching,
    isLoading,
    resource,
}: any) => ({
    // Necessary for actions (EditActions) which expect a data prop containing the record
    // @deprecated - to be removed in 4.0d
    record: record || data,
    data: record || data,
    defaultTitle,
    isFetching,
    isLoading,
    resource,
});
