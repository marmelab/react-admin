import * as React from 'react';
import { ReactNode } from 'react';
import {
    useInfiniteListController,
    InfiniteListControllerProps,
} from './useInfiniteListController';
import { ResourceContextProvider } from '../../core';
import { RaRecord } from '../../types';
import { ListContextProvider } from './ListContextProvider';
import { InfinitePaginationContext } from './InfinitePaginationContext';

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
    children,
    ...props
}: InfiniteListControllerProps<RecordType> & { children: ReactNode }) => {
    const controllerProps = useInfiniteListController<RecordType>(props);
    return (
        <ResourceContextProvider value={props.resource}>
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
                    {children}
                </InfinitePaginationContext.Provider>
            </ListContextProvider>
        </ResourceContextProvider>
    );
};
