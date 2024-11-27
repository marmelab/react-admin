import { useQueryClient } from '@tanstack/react-query';
import { useNotify } from '../../notification';
import { useDataProvider } from '../../dataProvider';
import { useRecordSelection } from './useRecordSelection';
import type { ListParams } from './useListParams';
import type { FilterPayload } from '../../types';

/**
 * Function hook to select all items of a list (until we reached the selectAllLimit)
 *
 * @param {string} resource Required. The resource name
 * @param {ListParams} query Required. The query object used to fetch the list of items
 * @param {number} selectAllLimit Optional. The number of items selected by the "SELECT ALL" button of the bulk actions toolbar
 * @param {FilterPayload} filter Optional. Permanent filter applied to all getList queries, regardless of the user selected filters
 * @param {any} meta Optional. Additional meta data to pass to the dataProvider
 * @returns {Function} onSelectAll A function to select all items of a list
 *
 * @example
 *
 * const onSelectAll = useSelectAll({
 *     resource: 'posts',
 *     query: { sort: 'title', order: 'ASC' },
 *     selectAllLimit: 250,
 * });
 * return <Button onClick={onSelectAll}>Select All</Button>;
 */
export const useSelectAll = ({
    query,
    resource,
    selectAllLimit = 250,
    filter = {},
    meta = {},
}: useSelectAllProps): (() => void) => {
    const notify = useNotify();
    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const [_, selectionModifiers] = useRecordSelection({ resource });

    const onSelectAll = async () => {
        try {
            const { data } = await queryClient.fetchQuery({
                queryKey: [
                    resource,
                    'getList',
                    {
                        resource,
                        pagination: { page: 1, perPage: selectAllLimit },
                        sort: { field: query.sort, order: query.order },
                        filter: { ...query.filter, ...filter },
                        meta,
                    },
                ],
                queryFn: () =>
                    dataProvider.getList(resource, {
                        pagination: {
                            page: 1,
                            perPage: selectAllLimit,
                        },
                        sort: { field: query.sort, order: query.order },
                        filter: { ...query.filter, ...filter },
                        meta,
                    }),
            });

            const allIds = data?.map(({ id }) => id) || [];
            selectionModifiers.select(allIds);
            if (allIds.length === selectAllLimit) {
                notify('ra.message.too_many_elements', {
                    messageArgs: { max: selectAllLimit },
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
    resource: string;
    query: ListParams;
    selectAllLimit?: number;
    filter?: FilterPayload;
    meta?: any;
}
