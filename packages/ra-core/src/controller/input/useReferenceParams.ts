import { useCallback, useMemo, useState, useRef } from 'react';
import lodashDebounce from 'lodash/debounce';

import { SortPayload, FilterItem } from '../../types';
import removeEmpty from '../../util/removeEmpty';
import {
    queryReducer,
    HIDE_FILTER,
    SET_FILTERS,
    SET_PAGE,
    SET_PER_PAGE,
    SET_SORT,
    SHOW_FILTER,
    SORT_ASC,
} from '../list';

/**
 * Get the reference inputs parameters (page, sort, filters) and modifiers.
 *
 * @returns {Array} A tuple [parameters, modifiers].
 * Destructure as [
 *    { page, perPage, sort, order, filters, displayedFilters, requestSignature },
 *    { setFilters, hideFilter, showFilter, setPage, setPerPage, setSort }
 * ]
 *
 * @example
 *
 * const [referenceParams, referenceParamsActions] = useReferenceParams({
 *      resource: 'posts',
 *      filterDefaultValues: {
 *          published: true
 *      },
 *      sort: {
 *          field: 'published_at',
 *          order: 'DESC'
 *      },
 *      perPage: 25
 * });
 *
 * const {
 *      page,
 *      perPage,
 *      sort,
 *      order,
 *      filters,
 *      displayedFilters,
 *      requestSignature
 * } = referenceParams;
 *
 * const {
 *      setFilters,
 *      hideFilter,
 *      showFilter,
 *      setPage,
 *      setPerPage,
 *      setSort,
 * } = referenceParamsActions;
 */
export const useReferenceParams = ({
    resource,
    filterDefaultValues,
    sort = defaultSort,
    page = 1,
    perPage = 10,
    debounce = 500,
}: ReferenceParamsOptions): [Parameters, Modifiers] => {
    const [params, setParams] = useState<Partial<ReferenceParams>>();
    const tempParams = useRef<Partial<ReferenceParams>>();

    const requestSignature = [
        resource,
        JSON.stringify(params),
        JSON.stringify(filterDefaultValues),
        JSON.stringify(sort),
        page,
        perPage,
    ];

    const query = useMemo(
        () =>
            getQuery({
                params,
                filterDefaultValues,
                sort,
                page,
                perPage,
            }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const changeParams = useCallback(action => {
        if (!tempParams.current) {
            // no other changeParams action dispatched this tick
            tempParams.current = queryReducer(query, action);
            // schedule side effects for next tick
            setTimeout(() => {
                setParams(tempParams.current);
                tempParams.current = undefined;
            }, 0);
        } else {
            // side effects already scheduled, just change the params
            tempParams.current = queryReducer(tempParams.current, action);
        }
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    const setSort = useCallback(
        (sort: SortPayload) =>
            changeParams({
                type: SET_SORT,
                payload: sort,
            }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const setPage = useCallback(
        (newPage: number) => changeParams({ type: SET_PAGE, payload: newPage }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const setPerPage = useCallback(
        (newPerPage: number) =>
            changeParams({ type: SET_PER_PAGE, payload: newPerPage }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const debouncedSetFilters = lodashDebounce(
        (
            filters: FilterItem[],
            displayedFilters: { [key: string]: boolean }
        ) => {
            changeParams({
                type: SET_FILTERS,
                payload: {
                    filters: removeEmpty(filters),
                    displayedFilters,
                },
            });
        },
        debounce
    );

    const setFilters = useCallback(
        (
            filters: FilterItem[],
            displayedFilters: { [key: string]: boolean },
            debounce: boolean = true
        ) => {
            debounce
                ? debouncedSetFilters(filters, displayedFilters)
                : changeParams({
                      type: SET_FILTERS,
                      payload: {
                          filters: removeEmpty(filters),
                          displayedFilters,
                      },
                  });
        },
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    const hideFilter = useCallback((filterName: string) => {
        changeParams({
            type: HIDE_FILTER,
            payload: filterName,
        });
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    const showFilter = useCallback((filterName: string, defaultValue: any) => {
        changeParams({
            type: SHOW_FILTER,
            payload: {
                filterName,
                defaultValue,
            },
        });
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    return [
        {
            filters: query.filters || emptyArray,
            displayedFilters: query.displayedFilters || emptyObject,
            requestSignature,
            ...query,
        },
        {
            changeParams,
            setPage,
            setPerPage,
            setSort,
            setFilters,
            hideFilter,
            showFilter,
        },
    ];
};

export const validQueryParams = [
    'page',
    'perPage',
    'sort',
    'order',
    'filter',
    'displayedFilters',
];

/**
 * Merge list params from 2 different sources:
 *   - the params stored in the local state
 *   - the props passed to the Reference component (including the filter defaultValues)
 */
export const getQuery = ({
    params,
    filterDefaultValues,
    sort,
    page,
    perPage,
}: {
    params?: Partial<ReferenceParams>;
    filterDefaultValues?: FilterItem[];
    sort: SortPayload;
    page: number;
    perPage: number;
}): ReferenceParams => {
    const query: Partial<ReferenceParams> = hasCustomParams(params)
        ? { ...params }
        : { filters: filterDefaultValues || [] };

    if (!query.sort) {
        query.sort = sort.field;
        query.order = sort.order;
    }
    if (query.page == null) {
        query.page = page;
    }
    if (query.perPage == null) {
        query.perPage = perPage;
    }
    if (query.page == null) {
        query.page = 1;
    }

    return {
        ...query,
        page: getNumberOrDefault(query.page, 1),
        perPage: getNumberOrDefault(query.perPage, 10),
    } as ReferenceParams;
};

/**
 * Check if user has already set custom sort, page, or filters for this list
 *
 * User params come from the store as the params props. By default,
 * this object is:
 *
 * { filters: [], order: null, page: 1, perPage: null, sort: null }
 *
 * To check if the user has custom params, we must compare the params
 * to these initial values.
 *
 * @param {Object} params
 */
export const hasCustomParams = (params: Partial<ReferenceParams>) => {
    return (
        params &&
        ((params.filters && params.filters.length > 0) ||
            params.order != null ||
            (params.page && params.page !== 1) ||
            params.perPage != null ||
            params.sort != null)
    );
};

export const getNumberOrDefault = (
    possibleNumber: string | number | undefined,
    defaultValue: number
) => {
    const parsedNumber =
        typeof possibleNumber === 'string'
            ? parseInt(possibleNumber, 10)
            : possibleNumber;

    return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};

export interface ReferenceParamsOptions {
    resource: string;
    page?: number;
    perPage?: number;
    sort?: SortPayload;
    // default value for a filter when displayed but not yet set
    filterDefaultValues?: FilterItem[];
    debounce?: number;
}

export interface ReferenceParams {
    sort: string;
    order: string;
    page: number;
    perPage: number;
    filters: FilterItem[];
    displayedFilters: {
        [key: string]: boolean;
    };
}

interface Parameters extends ReferenceParams {
    requestSignature: any[];
}

interface Modifiers {
    changeParams: (action: any) => void;
    setPage: (page: number) => void;
    setPerPage: (pageSize: number) => void;
    setSort: (sort: SortPayload) => void;
    setFilters: (
        filters: FilterItem[],
        displayedFilters: {
            [key: string]: boolean;
        }
    ) => void;
    hideFilter: (filterName: string) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
}

const emptyObject = {};
const emptyArray = [];

const defaultSort = {
    field: 'id',
    order: SORT_ASC,
};
