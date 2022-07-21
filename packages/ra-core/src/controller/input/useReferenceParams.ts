import { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import lodashDebounce from 'lodash/debounce';

import { SortPayload, FilterPayload } from '../../types';
import removeEmpty from '../../util/removeEmpty';
import {
    queryReducer,
    HIDE_FILTER,
    SET_FILTER,
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
 *    { page, perPage, sort, order, filter, filterValues, displayedFilters, requestSignature },
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
 *      filter,
 *      filterValues,
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
    filter,
    sort = defaultSort,
    page = 1,
    perPage = 10,
    debounce = 500,
}: ReferenceParamsOptions): [Parameters, Modifiers] => {
    const [params, setParams] = useState(defaultParams);
    const tempParams = useRef<ReferenceParams>();

    const requestSignature = [
        resource,
        JSON.stringify(params),
        JSON.stringify(filter),
        JSON.stringify(sort),
        page,
        perPage,
    ];

    const query = useMemo(
        () =>
            getQuery({
                params: params,
                filterDefaultValues: filter,
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

    const filterValues = query.filter || emptyObject;
    const displayedFilterValues = query.displayedFilters || emptyObject;

    const debouncedSetFilters = useRef(
        lodashDebounce((filter, displayedFilters) => {
            changeParams({
                type: SET_FILTER,
                payload: {
                    filter: removeEmpty(filter),
                    displayedFilters,
                },
            });
        }, debounce)
    );
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            debouncedSetFilters.current.cancel();
        };
    }, []);

    const setFilters = useCallback(
        (filter, displayedFilters, debounce = true) => {
            debounce
                ? debouncedSetFilters.current(filter, displayedFilters)
                : changeParams({
                      type: SET_FILTER,
                      payload: {
                          filter: removeEmpty(filter),
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
            displayedFilters: displayedFilterValues,
            filterValues,
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
 *   - the props passed to the List component (including the filter defaultValues)
 */
export const getQuery = ({
    params,
    filterDefaultValues,
    sort,
    page,
    perPage,
}) => {
    const query: Partial<ReferenceParams> = hasCustomParams(params)
        ? { ...params }
        : { filter: filterDefaultValues || {} };

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
 * User params come from the Redux store as the params props. By default,
 * this object is:
 *
 * { filter: {}, order: null, page: 1, perPage: null, sort: null }
 *
 * To check if the user has custom params, we must compare the params
 * to these initial values.
 *
 * @param {Object} params
 */
export const hasCustomParams = (params: ReferenceParams) => {
    return (
        params &&
        params.filter &&
        (Object.keys(params.filter).length > 0 ||
            params.order != null ||
            params.page !== 1 ||
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
    filter?: FilterPayload;
    debounce?: number;
}

export interface ReferenceParams {
    sort: string;
    order: string;
    page: number;
    perPage: number;
    filter: any;
    displayedFilters: any;
}

interface Parameters extends ReferenceParams {
    filterValues: object;
    displayedFilters: {
        [key: string]: boolean;
    };
    requestSignature: any[];
}

interface Modifiers {
    changeParams: (action: any) => void;
    setPage: (page: number) => void;
    setPerPage: (pageSize: number) => void;
    setSort: (sort: SortPayload) => void;
    setFilters: (filters: any, displayedFilters: any) => void;
    hideFilter: (filterName: string) => void;
    showFilter: (filterName: string, defaultValue: any) => void;
}

const emptyObject = {};

const defaultSort = {
    field: 'id',
    order: SORT_ASC,
};

const defaultParams = {};
