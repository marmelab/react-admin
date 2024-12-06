import { useQueryClient } from '@tanstack/react-query';
import { useNotify } from '../../notification';
import { useDataProvider } from '../../dataProvider';
import { useRecordSelection } from './useRecordSelection';
import type { FilterPayload, SortPayload } from '../../types';
import { useResourceContext } from '../../core';

/**
 * Function hook to select all items of a list (until we reached the selectAllLimit)
 *
 * @param {SortPayload} sort Optional. The sort parameter to apply to the getList query
 * @param {FilterPayload} filter Optional. Permanent filter applied to all getList queries, regardless of the user selected filters
 * @param {any} meta Optional. Additional meta data to pass to the dataProvider
 * @param {number} limit Optional. The number of items selected by the "SELECT ALL" button of the bulk actions toolbar
 * @returns {Function} onSelectAll A function to select all items of a list
 *
 * @example
 *
 * const onSelectAll = useSelectAll({
 *     sort: { sort: 'title', order: 'ASC' },
 *     limit: 250,
 * });
 * return <Button onClick={onSelectAll}>Select All</Button>;
 */
export const useSelectAll = ({
    sort = { field: 'id', order: 'ASC' },
    filter = {},
    meta = {},
    limit = 250,
}: useSelectAllProps): (() => void) => {
    const resource = useResourceContext();
    if (!resource) {
        throw new Error(
            'useSelectAll should be used inside a ResourceContextProvider'
        );
    }
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const [_, selectionModifiers] = useRecordSelection({ resource });

    // TODO: useCallback
    const onSelectAll = async () => {
        try {
            const { data } = await queryClient.fetchQuery({
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

            const allIds = data?.map(({ id }) => id) || [];
            selectionModifiers.select(allIds);
            if (allIds.length === limit) {
                notify('ra.message.too_many_elements', {
                    messageArgs: { max: limit },
                    type: 'warning',
                });
            }

            return data;
        } catch (error) {
            console.error('Mutation Error: ', error);
            notify('An error occurred. Please try again.');
        }
    };
    return onSelectAll;
};

export interface useSelectAllProps {
    sort?: SortPayload;
    filter?: FilterPayload;
    meta?: any;
    limit?: number;
}
