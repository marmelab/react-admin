import * as React from 'react';
import { ReactNode } from 'react';
import { useListController, ListControllerProps } from './useListController';
import { ResourceContextProvider } from '../../core';
import { RaRecord } from '../../types';
import { ListContextProvider } from './ListContextProvider';

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
    ...props
}: ListControllerProps<RecordType> & { children: ReactNode }) => (
    <ResourceContextProvider value={props.resource}>
        <ListContextProvider value={useListController<RecordType>(props)}>
            {children}
        </ListContextProvider>
    </ResourceContextProvider>
);
