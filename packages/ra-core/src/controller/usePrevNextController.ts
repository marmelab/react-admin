import {
    UseQueryOptions,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useResourceContext } from '../core';
import { useDataProvider } from '../dataProvider';
import { useStore } from '../store';
import { FilterPayload, RaRecord, SortPayload } from '../types';
import { ListParams, SORT_ASC } from './list';
import { useRecordContext } from './record';
import { useCreatePath } from '../routing';

/**
 * A hook used to fetch the previous and next record identifiers for a given record and resource.
 *
 * It fetches the list of records according to the filters
 * and the sort order configured in the list, and merges
 * the filters and the sorting order passed as props.
 *
 * usePrevNextController can be used anywhere a record context is provided
 * (often inside a `<Show>` or `<Edit>` component).
 *
 * @example <caption>Simple usage</caption>
 *
 * import { usePrevNextControllerProps } from 'ra-core';
 * const {
 *         hasPrev,
 *         hasNext,
 *         prevPath,
 *         nextPath,
 *         index,
 *         total,
 *         error,
 *         isPending,
 *     } = usePrevNextController(props);
 *
 * @example <caption>Custom PrevNextButton</caption>
 *
 * import { UsePrevNextControllerProps, useTranslate } from 'ra-core';
 * import NavigateBefore from '@mui/icons-material/NavigateBefore';
 * import NavigateNext from '@mui/icons-material/NavigateNext';
 * import ErrorIcon from '@mui/icons-material/Error';
 * import { Link } from 'react-router-dom';
 * import { CircularProgress, IconButton } from '@mui/material';
 *
 * const MyPrevNextButtons = props => {
 *     const {
 *         hasPrev,
 *         hasNext,
 *         nextPath,
 *         prevPath,
 *         index,
 *         total,
 *         error,
 *         isPending,
 *     } = usePrevNextController(props);
 *
 *     const translate = useTranslate();
 *
 *     if (isPending) {
 *         return <CircularProgress size={14} />;
 *     }
 *
 *     if (error) {
 *         return (
 *             <ErrorIcon
 *                 color="error"
 *                 fontSize="small"
 *                 titleAccess="error"
 *                 aria-errormessage={error.message}
 *             />
 *         );
 *     }
 *
 *     return (
 *         <ul>
 *             <li>
 *                 <IconButton
 *                     component={hasPrev ? Link : undefined}
 *                     to={navigateToPrev}
 *                     aria-label={translate('ra.navigation.previous')}
 *                     disabled={!hasPrev}
 *                 >
 *                     <NavigateBefore />
 *                 </IconButton>
 *             </li>
 *             {typeof index === 'number' && (
 *                 <li>
 *                     {index + 1} / {total}
 *                 </li>
 *             )}
 *             <li>
 *                 <IconButton
 *                     component={hasNext ? Link : undefined}
 *                     to={navigateToNext}
 *                     aria-label={translate('ra.navigation.next')}
 *                     disabled={!hasNext}
 *                 >
 *                     <NavigateNext />
 *                 </IconButton>
 *             </li>
 *         </ul>
 *     );
 * };
 */

export const usePrevNextController = <RecordType extends RaRecord = any>(
    props: UsePrevNextControllerProps<RecordType>
): UsePrevNextControllerResult => {
    const {
        linkType = 'edit',
        storeKey,
        limit = 1000,
        sort: initialSort = { field: 'id', order: SORT_ASC },
        filter: permanentFilter = {},
        filterDefaultValues = {},
        queryOptions = {
            staleTime: 5 * 60 * 1000,
        },
    } = props;

    const record = useRecordContext<RecordType>(props);
    const resource = useResourceContext(props);
    const createPath = useCreatePath();

    if (!resource) {
        throw new Error(
            `useNextPrevController was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
        );
    }

    const [storedParams] = useStore<ListParams>(
        storeKey || `${resource}.listParams`,
        {
            filter: filterDefaultValues,
            order: initialSort.order,
            sort: initialSort.field,
            page: 1,
            perPage: 10,
            displayedFilters: {},
        }
    );

    const dataProvider = useDataProvider();
    const queryClient = useQueryClient();
    const pagination = { page: 1, perPage: limit };
    const sort = {
        field: storedParams.sort,
        order: storedParams.order,
    };
    const filter = { ...storedParams.filter, ...permanentFilter };
    const { meta, ...otherQueryOptions } = queryOptions;
    const params = { pagination, sort, filter, meta };

    // try to use data from the cache first
    const queryData = queryClient.getQueryData<{
        data: RaRecord[];
        total: number;
    }>([
        resource,
        'getList',
        {
            ...params,
            pagination: {
                page: storedParams.page,
                perPage: storedParams.perPage,
            },
        },
    ]);
    const recordIndexInQueryData = queryData?.data?.findIndex(
        r => r.id === record?.id
    );
    const isRecordIndexFirstInNonFirstPage =
        recordIndexInQueryData === 0 && storedParams.page > 1;
    const isRecordIndexLastInNonLastPage =
        queryData?.data && queryData?.total
            ? recordIndexInQueryData === queryData?.data?.length - 1 &&
              storedParams.page < queryData?.total / storedParams.perPage
            : undefined;
    const canUseCacheData =
        record &&
        queryData?.data &&
        recordIndexInQueryData !== -1 &&
        !isRecordIndexFirstInNonFirstPage &&
        !isRecordIndexLastInNonLastPage;

    // If the previous and next ids are not in the cache, fetch the entire list.
    // This is necessary e.g. when coming directly to a detail page,
    // without displaying the list first
    const { data, error, isFetching, isLoading, isPending } = useQuery({
        queryKey: [resource, 'getList', params],
        queryFn: queryParams => {
            return dataProvider.getList(resource, {
                ...params,
                signal:
                    dataProvider.supportAbortSignal === true
                        ? queryParams.signal
                        : undefined,
            });
        },
        enabled: !canUseCacheData,
        ...otherQueryOptions,
    });

    const finalData = canUseCacheData ? queryData.data : data?.data || [];

    if (!record || (isPending && !canUseCacheData))
        return {
            isFetching: true,
            isLoading: true,
            isPending: true,
            prevPath: undefined,
            nextPath: undefined,
            index: undefined,
            total: undefined,
            hasPrev: false,
            hasNext: false,
        };

    const ids = finalData.map(record => record.id);
    const index = ids.indexOf(record.id);
    const previousId =
        typeof ids[index - 1] !== 'undefined' ? ids[index - 1] : null; // could be 0
    const nextId =
        index !== -1 && index < ids.length - 1 ? ids[index + 1] : null;

    return {
        hasPrev: previousId !== null,
        hasNext: nextId !== null,
        prevPath:
            previousId !== null
                ? createPath({
                      type: linkType,
                      resource,
                      id: previousId,
                  })
                : undefined,
        nextPath:
            nextId !== null
                ? createPath({
                      type: linkType,
                      resource,
                      id: nextId,
                  })
                : undefined,
        index:
            index === -1
                ? undefined
                : index +
                  (canUseCacheData
                      ? (storedParams.perPage ?? 0) *
                        ((storedParams.page ?? 1) - 1)
                      : 0),
        total: canUseCacheData ? queryData?.total : data?.total,
        error,
        isFetching: canUseCacheData ? false : isFetching,
        isLoading: canUseCacheData ? false : isLoading,
        isPending: canUseCacheData ? false : isPending,
    };
};

export interface UsePrevNextControllerProps<RecordType extends RaRecord = any> {
    linkType?: 'edit' | 'show';
    storeKey?: string | false;
    limit?: number;
    filter?: FilterPayload;
    filterDefaultValues?: FilterPayload;
    sort?: SortPayload;
    resource?: string;
    queryOptions?: Omit<
        UseQueryOptions<{
            data: RecordType[];
            total?: number;
            pageInfo?: {
                hasNextPage?: boolean;
                hasPreviousPage?: boolean;
            };
        }>,
        'queryFn' | 'queryKey'
    > & { meta?: any };
}

export type UsePrevNextControllerResult = {
    isFetching: boolean;
    isLoading: boolean;
    isPending: boolean;
    hasPrev: boolean;
    hasNext: boolean;
    prevPath: string | undefined;
    nextPath: string | undefined;
    index: number | undefined;
    total: number | undefined;
    error?: any;
};
