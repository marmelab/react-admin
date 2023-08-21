import { UseQueryOptions } from 'react-query';
import { useResourceContext } from '../core';
import { useGetList } from '../dataProvider';
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
 *         isLoading,
 *     } = usePrevNextController(props);
 *
 * @example <caption>Custom PrevNextButton</caption>
 *
 * import { UsePrevNextControllerProps, useTranslate } from 'ra-core';
 * import { NavigateBefore, NavigateNext } from '@mui/icons-material';
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
 *         isLoading,
 *     } = usePrevNextController(props);
 *
 *     const translate = useTranslate();
 *
 *     if (isLoading) {
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
        sort = { field: 'id', order: SORT_ASC },
        filter = {},
        queryOptions = {
            staleTime: 5 * 60 * 1000,
        },
    } = props;

    const record = useRecordContext<RecordType>(props);
    const resource = useResourceContext(props);
    const createPath = useCreatePath();

    if (!resource) {
        throw new Error(
            `<useNextPrevController> was called outside of a ResourceContext and without a resource prop. You must set the resource prop.`
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
                ...sort,
                field: storedParams.sort,
                order: storedParams.order,
            },
            filter: { ...storedParams.filter, ...filter },
            pagination: { page: 1, perPage: limit },
        },
        queryOptions
    );

    if (!record) return null;

    const ids = data ? data.map(record => record.id) : [];

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
    prevPath: string | undefined;
    nextPath: string | undefined;
    index: number | undefined;
    total: number | undefined;
    error?: any;
    isLoading: boolean;
}

type StoredParams = Pick<ListParams, 'filter' | 'order' | 'sort'>;
