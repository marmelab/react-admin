import { WrappedFieldInputProps } from 'redux-form';

import { getStatusForInput as getDataStatus } from './referenceDataStatus';
import useTranslate from '../../i18n/useTranslate';
import { Sort, Record, Pagination } from '../../types';
import useReference from '../useReference';
import useGetMatchingReferences from './useGetMatchingReferences';
import usePaginationState from '../usePaginationState';
import { useSortState } from '..';
import useFilterState from '../useFilterState';

const defaultReferenceSource = (resource: string, source: string) =>
    `${resource}@${source}`;

interface ReferenceInputValue {
    choices: Record[];
    error?: string;
    loading: boolean;
    pagination: Pagination;
    setFilter: (filter: string) => void;
    filter: any;
    setPagination: (pagination: Pagination) => void;
    setSort: (sort: Sort) => void;
    sort: Sort;
    warning?: string;
}

interface Option {
    allowEmpty?: boolean;
    permanentFilter?: any;
    filterToQuery?: (filter: string) => any;
    input?: WrappedFieldInputProps;
    perPage?: number;
    record?: Record;
    reference: string;
    referenceSource?: typeof defaultReferenceSource;
    resource: string;
    sort?: Sort;
    source: string;
}

/**
 * A hook for choosing a reference record. Useful for foreign keys.
 *
 * This hook fetches the possible values in the reference resource
 * (using the `CRUD_GET_MATCHING` REST method), it returns the possible choices
 * as the `choices` attribute.
 *
 * @example
 * const {
 *      choices, // the available reference resource
 * } = useReferenceInput({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 * });
 *
 * The hook alos allow to filter results. it returns a `setFilter`
 * function. It uses the value to create a filter
 * for the query - by default { q: [searchText] }. You can customize the mapping
 * searchText => searchQuery by setting a custom `filterToQuery` function option
 * You can also add a permanentFilter to further filter the result:
 *
 * @example
 * const {
 *      choices, // the available reference resource
 *      setFilter,
 * } = useReferenceInput({
 *      input, // the input props
 *      resource: 'comments',
 *      reference: 'posts',
 *      source: 'post_id',
 *      permanentFilter: {
 *          author: 'john'
 *      },
 *      filterToQuery: searchText => ({ title: searchText })
 * });
 */
export default ({
    input,
    perPage = 25,
    permanentFilter = {},
    reference,
    filterToQuery,
    referenceSource = defaultReferenceSource,
    resource,
    source,
}: Option): ReferenceInputValue => {
    const translate = useTranslate();

    const { pagination, setPagination } = usePaginationState({ perPage });
    const { sort, setSort } = useSortState();
    const { filter, setFilter } = useFilterState({
        permanentFilter,
        filterToQuery,
    });

    const { matchingReferences } = useGetMatchingReferences({
        reference,
        referenceSource,
        filter,
        pagination,
        sort,
        resource,
        source,
    });

    const { referenceRecord } = useReference({
        id: input.value,
        reference,
        allowEmpty: true,
    });

    const dataStatus = getDataStatus({
        input,
        matchingReferences,
        referenceRecord,
        translate,
    });

    return {
        choices: dataStatus.choices,
        error: dataStatus.error,
        loading: dataStatus.waiting,
        filter,
        setFilter,
        pagination,
        setPagination,
        sort,
        setSort,
        warning: dataStatus.warning,
    };
};
