import { useQueryClient } from '@tanstack/react-query';

import { useNotify } from '../../notification';
import { useDataProvider, UseGetListOptions } from '../../dataProvider';
import { useRecordSelection } from './useRecordSelection';
import { useResourceContext } from '../../core';
import { useEvent } from '../../util';
import type { FilterPayload, RaRecord, SortPayload } from '../../types';

/**
 * Get a callback to select all records of a resource (capped by the limit parameter)
 *
 * @param {Object} params The hook parameters { resource, sort, filter }
 * @returns {Function} handleSelectAll A function to select all items of a list
 *
 * @example
 * import { List, Datagrid, BulkActionsToolbar, BulkDeleteButton, useListContext, useSelectAll } from 'react-admin';
 *
 * const MySelectAllButton = () => {
 *   const { sort, filter } = useListContext();
 *   const handleSelectAll = useSelectAll({ resource: 'posts', sort, filter });
 *   const handleClick = () => handleSelectAll({
 *       queryOptions: { meta: { foo: 'bar' } },
 *       limit: 250,
 *   });
 *   return <button onClick={handleClick}>Select All</button>;
 * };
 *
 * const PostBulkActionsToolbar = () => (
 *     <BulkActionsToolbar actions={<MySelectAllButton/>}>
 *         <BulkDeleteButton />
 *     </BulkActionsToolbar>
 * );
 *
 * export const PostList = () => (
 *     <List>
 *         <Datagrid bulkActionsToolbar={<PostBulkActionsToolbar />}>
 *             ...
 *         </Datagrid>
 *     </List>
 * );
 */
export const useSelectAll = (
    params: UseSelectAllParams
): UseSelectAllResult => {
    const { sort, filter } = params;
    const resource = useResourceContext(params);
    if (!resource) {
        throw new Error(
            'useSelectAll should be used inside a ResourceContextProvider or passed a resource prop'
        );
    }
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const [, { select }] = useRecordSelection({ resource });
    const notify = useNotify();

    const handleSelectAll = useEvent(
        async ({
            queryOptions = {},
            limit = 250,
        }: HandleSelectAllParams = {}) => {
            const { meta, onSuccess, onError, ...otherQueryOptions } =
                queryOptions;
            try {
                const results = await queryClient.fetchQuery({
                    queryKey: [
                        resource,
                        'getList',
                        {
                            pagination: { page: 1, perPage: limit },
                            sort,
                            filter,
                            meta,
                        },
                    ],
                    queryFn: () =>
                        dataProvider.getList(resource, {
                            pagination: {
                                page: 1,
                                perPage: limit,
                            },
                            sort,
                            filter,
                            meta,
                        }),
                    ...otherQueryOptions,
                });

                const allIds = results.data?.map(({ id }) => id) || [];
                select(allIds);
                if (allIds.length === limit) {
                    notify('ra.message.select_all_limit_reached', {
                        messageArgs: { max: limit },
                        type: 'warning',
                    });
                }

                if (onSuccess) {
                    onSuccess(results);
                }

                return results.data;
            } catch (error) {
                if (onError) {
                    onError(error);
                } else {
                    notify('ra.notification.http_error', { type: 'warning' });
                }
            }
        }
    );
    return handleSelectAll;
};

export interface UseSelectAllParams {
    resource?: string;
    sort?: SortPayload;
    filter?: FilterPayload;
}

export interface HandleSelectAllParams<RecordType extends RaRecord = any> {
    limit?: number;
    queryOptions?: UseGetListOptions<RecordType>;
}

export type UseSelectAllResult = (options?: HandleSelectAllParams) => void;
