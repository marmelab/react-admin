import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useNotify } from '../../notification';
import { useDataProvider, UseGetListOptions } from '../../dataProvider';
import { useRecordSelection } from './useRecordSelection';
import { useResourceContext } from '../../core';
import type { FilterPayload, RaRecord, SortPayload } from '../../types';

/**
 * Function hook to select all items of a list (until we reached the limit)
 *
 * @param {SortPayload} sort Optional. The sort object passed to the dataProvider
 * @param {FilterPayload} filter Optional. The filter object passed to the dataProvider
 * @returns {Function} onSelectAll A function to select all items of a list
 *
 * @example
 *
 * const MyButton = () => {
 *   const onSelectAll = useSelectAll({
 *       sort: { field: 'title', order: 'ASC' },
 *       filter: { title: 'foo' },
 *   });
 *   const handleClick = () => onSelectAll({
 *       queryOptions: { meta: { foo: 'bar' } },
 *       limit: 250,
 *   });
 *   return <Button onClick={handleClick}>Select All</Button>;
 * };
 */
export const useSelectAll = ({
    sort,
    filter,
}: useSelectAllProps): ((options?: onSelectAllProps) => void) => {
    const resource = useResourceContext();
    if (!resource) {
        throw new Error(
            'useSelectAll should be used inside a ResourceContextProvider'
        );
    }
    const [_, selectionModifiers] = useRecordSelection({ resource });
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const notify = useNotify();

    const onSelectAll = useCallback(
        async ({ queryOptions = {}, limit = 250 }: onSelectAllProps) => {
            const { meta, onSuccess, onError } = queryOptions;
            try {
                const results = await queryClient.fetchQuery({
                    queryKey: [
                        resource,
                        'getList',
                        {
                            resource,
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
                selectionModifiers.select(allIds);
                if (allIds.length === limit) {
                    notify('ra.message.too_many_elements', {
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
                console.error('Mutation Error: ', error);
                notify('An error occurred. Please try again.');
            }
        },
        [
            dataProvider,
            queryClient,
            notify,
            resource,
            sort,
            filter,
            selectionModifiers,
        ]
    );
    return onSelectAll;
};

export interface useSelectAllProps {
    sort?: SortPayload;
    filter?: FilterPayload;
}

export interface onSelectAllProps<RecordType extends RaRecord = any> {
    limit?: number;
    queryOptions?: UseGetListOptions<RecordType>;
}
