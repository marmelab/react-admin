import * as React from 'react';
import { ReactNode } from 'react';
import {
    useInfiniteListController,
    InfiniteListControllerProps,
    InfiniteListControllerResult,
} from './useInfiniteListController';
import { OptionalResourceContextProvider } from '../../core';
import { RaRecord } from '../../types';
import { ListContextProvider } from './ListContextProvider';
import { InfinitePaginationContext } from './InfinitePaginationContext';
import { useIsAuthPending } from '../../auth';

/**
 * Call useInfiniteListController and put the value in a ListContext
 *
 * Base class for <InfiniteList> components, without UI.
 *
 * Accepts any props accepted by useInfiniteListController:
 * - filter: permanent filter applied to the list
 * - filters: Filter element, to display the filters
 * - filterDefaultValues: object;
 * - perPage: Number of results per page
 * - sort: Default sort
 * - exporter: exported function
 *
 * @example // Custom list layout
 *
 * const PostList = () => (
 *     <InfiniteListBase perPage={10}>
 *         <div>
 *              List metrics...
 *         </div>
 *         <Grid container>
 *             <Grid item xs={8}>
 *                 <SimpleList primaryText={record => record.title} />
 *             </Grid>
 *             <Grid item xs={4}>
 *                 List instructions...
 *             </Grid>
 *         </Grid>
 *         <div>
 *             Post related links...
 *         </div>
 *     </ListBase>
 * );
 */
export const InfiniteListBase = <RecordType extends RaRecord = any>({
    authLoading,
    loading,
    offline,
    error,
    children,
    render,
    ...props
}: InfiniteListBaseProps<RecordType>) => {
    const controllerProps = useInfiniteListController<RecordType>(props);
    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'list',
    });

    if (!render && !children) {
        throw new Error(
            "<InfiniteListBase> requires either a 'render' prop or 'children' prop"
        );
    }

    const {
        isPaused,
        isPending,
        isPlaceholderData,
        error: errorState,
    } = controllerProps;

    const showAuthLoading =
        isAuthPending &&
        !props.disableAuthentication &&
        authLoading !== false &&
        authLoading !== undefined;

    const showLoading =
        !isPaused &&
        ((!props.disableAuthentication && isAuthPending) || isPending) &&
        loading !== false &&
        loading !== undefined;

    const showOffline =
        isPaused &&
        // If isPending and isPaused are true, we are offline and couldn't even load the initial data
        // If isPaused and isPlaceholderData are true, we are offline and couldn't even load data with different parameters on the same useQuery observer
        (isPending || isPlaceholderData) &&
        offline !== false &&
        offline !== undefined;

    const showError = errorState && error !== false && error !== undefined;

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <ListContextProvider value={controllerProps}>
                <InfinitePaginationContext.Provider
                    value={{
                        hasNextPage: controllerProps.hasNextPage,
                        fetchNextPage: controllerProps.fetchNextPage,
                        isFetchingNextPage: controllerProps.isFetchingNextPage,
                        hasPreviousPage: controllerProps.hasPreviousPage,
                        fetchPreviousPage: controllerProps.fetchPreviousPage,
                        isFetchingPreviousPage:
                            controllerProps.isFetchingPreviousPage,
                    }}
                >
                    {showAuthLoading
                        ? authLoading
                        : showLoading
                          ? loading
                          : showOffline
                            ? offline
                            : showError
                              ? error
                              : render
                                ? render(controllerProps)
                                : children}
                </InfinitePaginationContext.Provider>
            </ListContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface InfiniteListBaseProps<RecordType extends RaRecord = any>
    extends InfiniteListControllerProps<RecordType> {
    authLoading?: ReactNode;
    loading?: ReactNode;
    offline?: ReactNode;
    error?: ReactNode;
    children?: ReactNode;
    render?: (props: InfiniteListControllerResult<RecordType>) => ReactNode;
}
