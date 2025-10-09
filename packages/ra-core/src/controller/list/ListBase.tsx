import * as React from 'react';
import { ReactNode } from 'react';
import {
    useListController,
    ListControllerProps,
    ListControllerResult,
} from './useListController';
import { OptionalResourceContextProvider } from '../../core';
import { RaRecord } from '../../types';
import { ListContextProvider } from './ListContextProvider';
import { useIsAuthPending } from '../../auth';

/**
 * Call useListController and put the value in a ListContext
 *
 * Base class for <List> components, without UI.
 *
 * Accepts any props accepted by useListController:
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
 *     <ListBase perPage={10}>
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
export const ListBase = <RecordType extends RaRecord = any>({
    children,
    emptyWhileLoading,
    authLoading,
    loading,
    offline,
    error,
    empty,
    render,
    ...props
}: ListBaseProps<RecordType>) => {
    const controllerProps = useListController<RecordType>(props);
    const isAuthPending = useIsAuthPending({
        resource: controllerProps.resource,
        action: 'list',
    });

    if (!render && !children) {
        throw new Error(
            "<ListBase> requires either a 'render' prop or 'children' prop"
        );
    }

    const {
        isPaused,
        isPending,
        isPlaceholderData,
        error: errorState,
        data,
        total,
        hasPreviousPage,
        hasNextPage,
        filterValues,
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

    const showEmptyWhileLoading =
        isPending && !showOffline && emptyWhileLoading === true;

    const showEmpty =
        !errorState &&
        // the list is not loading data for the first time
        !isPending &&
        // the API returned no data (using either normal or partial pagination)
        (total === 0 ||
            (total == null &&
                hasPreviousPage === false &&
                hasNextPage === false &&
                // @ts-ignore FIXME total may be undefined when using partial pagination but the ListControllerResult type is wrong about it
                data.length === 0)) &&
        // the user didn't set any filters
        !Object.keys(filterValues).length &&
        // there is an empty page component
        empty !== undefined &&
        empty !== false;

    return (
        // We pass props.resource here as we don't need to create a new ResourceContext if the props is not provided
        <OptionalResourceContextProvider value={props.resource}>
            <ListContextProvider value={controllerProps}>
                {showAuthLoading
                    ? authLoading
                    : showLoading
                      ? loading
                      : showOffline
                        ? offline
                        : showError
                          ? error
                          : showEmptyWhileLoading
                            ? null
                            : showEmpty
                              ? empty
                              : render
                                ? render(controllerProps)
                                : children}
            </ListContextProvider>
        </OptionalResourceContextProvider>
    );
};

export interface ListBaseProps<RecordType extends RaRecord = any>
    extends ListControllerProps<RecordType> {
    emptyWhileLoading?: boolean;
    authLoading?: ReactNode;
    loading?: ReactNode;
    offline?: ReactNode;
    error?: ReactNode;
    empty?: ReactNode;
    children?: ReactNode;
    render?: (props: ListControllerResult<RecordType, Error>) => ReactNode;
}
