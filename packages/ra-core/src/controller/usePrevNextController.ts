import { UseQueryOptions } from 'react-query';
import { useResourceContext } from '../core';
import { useGetList } from '../dataProvider';
import { useStore } from '../store';
import { FilterPayload, RaRecord, SortPayload } from '../types';
import { ListParams, SORT_ASC } from './list';
import { useRecordContext } from './record';
import { useCreatePath } from '../routing';

export const usePrevNextController = <RecordType extends RaRecord = any>(
    props: UsePrevNextControllerProps<RecordType>
): UsePrevNextControllerResult => {
    const {
        linkType = 'edit',
        storeKey,
        limit = 1000,
        sort = { field: 'id', order: SORT_ASC },
        filter = {},
        queryOptions = {
            staleTime: 5 * 60 * 1000,
        },
    } = props;

    const record = useRecordContext<RecordType>(props);
    const resource = useResourceContext(props);

    if (!resource) {
        throw new Error(
            `<useNextPrevController> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }

    if (!record) {
        throw new Error(
            `<useNextPrevController> was called outside of a RecordContext and without a record prop. You must set the record prop.`
        );
    }

    const [storedParams] = useStore<StoredParams>(
        storeKey || `${resource}.listParams`,
        {
            filter,
            order: sort.order,
            sort: sort.field,
        }
    );

    const { data, error, isLoading } = useGetList<RecordType>(
        resource,
        {
            sort: {
                ...{ field: storedParams.sort, order: storedParams.order },
                ...sort,
            },
            filter: { ...storedParams.filter, ...filter },
            pagination: { page: 1, perPage: limit },
        },
        queryOptions
    );

    const ids = data ? data.map(record => record.id) : [];

    const index = ids.indexOf(record.id);

    const previousId =
        typeof ids[index - 1] !== 'undefined' ? ids[index - 1] : null; // could be 0

    const nextId =
        index !== -1 && index < ids.length - 1 ? ids[index + 1] : null;

    const createPath = useCreatePath();

    return {
        hasPrev: previousId !== null,
        hasNext: nextId !== null,
        navigateToPrev:
            previousId !== null
                ? createPath({
                      type: linkType,
                      resource,
                      id: previousId,
                  })
                : undefined,
        navigateToNext:
            nextId !== null
                ? createPath({
                      type: linkType,
                      resource,
                      id: nextId,
                  })
                : undefined,
        index: index === -1 ? undefined : index,
        total: data?.length,
        error,
        isLoading,
    };
};

export interface UsePrevNextControllerProps<RecordType extends RaRecord = any> {
    linkType?: 'edit' | 'show';
    storeKey?: string | false;
    limit?: number;
    filter?: FilterPayload;
    sort?: SortPayload;
    resource?: string;
    queryOptions?: UseQueryOptions<{
        data: RecordType[];
        total?: number;
        pageInfo?: {
            hasNextPage?: boolean;
            hasPreviousPage?: boolean;
        };
    }> & { meta?: any };
}

export interface UsePrevNextControllerResult {
    hasPrev: boolean;
    hasNext: boolean;
    navigateToPrev: string | undefined;
    navigateToNext: string | undefined;
    index: number | undefined;
    total: number | undefined;
    error?: any;
    isLoading: boolean;
}

type StoredParams = Pick<ListParams, 'filter' | 'order' | 'sort'>;
