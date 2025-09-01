import React from 'react';
import {
    useReferenceManyFieldController,
    type UseReferenceManyFieldControllerParams,
} from './useReferenceManyFieldController';
import { useTimeout } from '../../util/hooks';

/**
 * Fetch and render the number of records related to the current one
 *
 * Relies on dataProvider.getManyReference() returning a total property
 *
 * @example // Display the number of comments for the current post
 * <ReferenceManyCountBase reference="comments" target="post_id" />
 *
 * @example // Display the number of published comments for the current post
 * <ReferenceManyCountBase reference="comments" target="post_id" filter={{ is_published: true }} />
 */
export const ReferenceManyCountBase = (props: ReferenceManyCountBaseProps) => {
    const { loading, error, offline, timeout = 1000, ...rest } = props;
    const oneSecondHasPassed = useTimeout(timeout);

    const {
        isPaused,
        isPending,
        error: fetchError,
        total,
    } = useReferenceManyFieldController<any, any>({
        ...rest,
        page: 1,
        perPage: 1,
    });

    const shouldRenderLoading =
        isPending && !isPaused && loading !== undefined && loading !== false;
    const shouldRenderOffline =
        isPending && isPaused && offline !== undefined && offline !== false;
    const shouldRenderError =
        !isPending && fetchError && error !== undefined && error !== false;

    return (
        <>
            {shouldRenderLoading
                ? oneSecondHasPassed
                    ? loading
                    : null
                : shouldRenderOffline
                  ? offline
                  : shouldRenderError
                    ? error
                    : total}
        </>
    );
};

export interface ReferenceManyCountBaseProps
    extends UseReferenceManyFieldControllerParams {
    timeout?: number;
    loading?: React.ReactNode;
    error?: React.ReactNode;
    offline?: React.ReactNode;
}
