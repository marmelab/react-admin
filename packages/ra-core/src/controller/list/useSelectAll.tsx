import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNotify } from '../../notification';
import { useDataProvider, UseGetListOptions } from '../../dataProvider';
import { useRecordSelection } from './useRecordSelection';
import type { FilterPayload, RaRecord, SortPayload } from '../../types';

/**
 * Select all records of a resource (capped by the limit prop)
 *
 * @param {string} resource Required. The resource name
 * @param {SortPayload} sort Optional. The sort object passed to the dataProvider
 * @param {FilterPayload} filter Optional. The filter object passed to the dataProvider
 * @returns {Function} onSelectAll A function to select all items of a list
 *
 * @example // TODO: Update this example after updating the button position in the toolbar
 *
 * const MySelectAllButton = () => {
 *   const { sort, filter } = useListContext();
 *   const onSelectAll = useSelectAll({ resource: 'posts', sort, filter });
 *   const handleClick = () => onSelectAll({
 *       queryOptions: { meta: { foo: 'bar' } },
 *       limit: 250,
 *   });
 *   return <Button onClick={handleClick}>Select All</Button>;
 * };
 *
 * const PostList = () => (
 *   <List>
 *     <Datagrid bulkActionButtons={<MySelectAllButton />}>
 *       // ...
 *     </Datagrid>
 *   </List>
 * );
 */
export const useSelectAll = ({
    resource,
    sort,
    filter,
}: useSelectAllProps): ((options?: onSelectAllParams) => void) => {
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const [, { select }] = useRecordSelection({ resource });
    const notify = useNotify();

    const onSelectAll = useCallback(
        async ({ queryOptions = {}, limit = 250 }: onSelectAllParams = {}) => {
            const { meta, onSuccess, onError } = queryOptions;
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
                }
                notify('ra.notification.simple_error', { type: 'warning' });
            }
        },
        [queryClient, resource, sort, filter, select, dataProvider, notify]
    );
    return onSelectAll;
};

export interface useSelectAllProps {
    resource: string;
    sort?: SortPayload;
    filter?: FilterPayload;
}

export interface onSelectAllParams<RecordType extends RaRecord = any> {
    limit?: number;
    queryOptions?: UseGetListOptions<RecordType>;
}
