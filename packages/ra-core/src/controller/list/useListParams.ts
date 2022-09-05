import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { parse, stringify } from 'query-string';
import lodashDebounce from 'lodash/debounce';
import pickBy from 'lodash/pickBy';
import { useNavigate, useLocation } from 'react-router-dom';

import { useStore } from '../../store';
import queryReducer, {
    SET_FILTER,
    HIDE_FILTER,
    SHOW_FILTER,
    SET_PAGE,
    SET_PER_PAGE,
    SET_SORT,
    SORT_ASC,
} from './queryReducer';
import { SortPayload, FilterPayload } from '../../types';
import removeEmpty from '../../util/removeEmpty';
import { useIsMounted } from '../../util/hooks';

export interface ListParams {
    sort: string;
    order: string;
    page: number;
    perPage: number;
    filter: any;
    displayedFilters: any;
}

/**
 * Get the list parameters (page, sort, filters) and modifiers.
 *
 * These parameters are merged from 3 sources:
 *   - the query string from the URL
 *   - the params stored in the state (from previous navigation)
 *   - the options passed to the hook (including the filter defaultValues)
 *
 * @returns {Array} A tuple [parameters, modifiers].
 * Destructure as [
 *    { page, perPage, sort, order, filter, filterValues, displayedFilters, requestSignature },
 *    { setFilters, hideFilter, showFilter, setPage, setPerPage, setSort }
 * ]
 *
 * @example
 *
 * const [listParams, listParamsActions] = useListParams({
 *      resource: 'posts',
 *      location: location // From react-router. Injected to your component by react-admin inside a List
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
 * } = listParams;
 *
 * const {
 *      setFilters,
 *      hideFilter,
 *      showFilter,
 *      setPage,
 *      setPerPage,
 *      setSort,
 * } = listParamsActions;
 */
export const useListParams = ({
    resource,
    filterDefaultValues,
    sort = defaultSort,
    perPage = 10,
    debounce = 500,
    disableSyncWithLocation = false,
}: ListParamsOptions): [Parameters, Modifiers] => {
    const location = useLocation();
    const navigate = useNavigate();
    const [localParams, setLocalParams] = useState(defaultParams);
    const storeKey = `${resource}.listParams`;
    const [params, setParams] = useStore(storeKey, defaultParams);
    const tempParams = useRef<ListParams>();
    const isMounted = useIsMounted();

    const requestSignature = [
        location.search,
        resource,
        JSON.stringify(disableSyncWithLocation ? localParams : params),
        JSON.stringify(filterDefaultValues),
        JSON.stringify(sort),
        perPage,
        disableSyncWithLocation,
    ];

    const queryFromLocation = disableSyncWithLocation
        ? {}
        : parseQueryFromLocation(location);

    const query = useMemo(
        () =>
            getQuery({
                queryFromLocation,
                params: disableSyncWithLocation ? localParams : params,
                filterDefaultValues,
                sort,
                perPage,
            }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    // if the location includes params (for example from a link like
    // the categories products on the demo), we need to persist them in the
    // store as well so that we don't lose them after a redirection back
    // to the list
    useEffect(() => {
        if (Object.keys(queryFromLocation).length > 0) {
            setParams(query);
        }
    }, [location.search]); // eslint-disable-line

    const changeParams = useCallback(
        action => {
            // do not change params if the component is already unmounted
            // this is necessary because changeParams can be debounced, and therefore
            // executed after the component is unmounted
            if (!isMounted.current) return;

            if (!tempParams.current) {
                // no other changeParams action dispatched this tick
                const nextLocalParams = queryReducer(query, action);
                tempParams.current = nextLocalParams;
                // schedule side effects for next tick
                setTimeout(() => {
                    if (disableSyncWithLocation) {
                        setLocalParams(nextLocalParams);
                    } else {
                        // the useEffect above will apply the changes to the params in the store
                        navigate(
                            {
                                search: `?${stringify({
                                    ...nextLocalParams,
                                    filter: JSON.stringify(
                                        nextLocalParams.filter
                                    ),
                                    displayedFilters: JSON.stringify(
                                        nextLocalParams.displayedFilters
                                    ),
                                })}`,
                            },
                            {
                                state: {
                                    _scrollToTop: action.type === SET_PAGE,
                                },
                            }
                        );
                    }
                    tempParams.current = undefined;
                }, 0);
            } else {
                // side effects already scheduled, just change the params
                tempParams.current = queryReducer(tempParams.current, action);
            }
        },
        [...requestSignature, navigate] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const setSort = useCallback(
        (sort: SortPayload) =>
            changeParams({
                type: SET_SORT,
                payload: sort,
            }),
        [changeParams]
    );

    const setPage = useCallback(
        (newPage: number) => changeParams({ type: SET_PAGE, payload: newPage }),
        [changeParams]
    );

    const setPerPage = useCallback(
        (newPerPage: number) =>
            changeParams({ type: SET_PER_PAGE, payload: newPerPage }),
        [changeParams]
    );

    const filterValues = query.filter || emptyObject;
    const displayedFilterValues = query.displayedFilters || emptyObject;

    const debouncedSetFilters = lodashDebounce((filter, displayedFilters) => {
        changeParams({
            type: SET_FILTER,
            payload: {
                filter: removeEmpty(filter),
                displayedFilters,
            },
        });
    }, debounce);

    const setFilters = useCallback(
        (filter, displayedFilters, debounce = true) =>
            debounce
                ? debouncedSetFilters(filter, displayedFilters)
                : changeParams({
                      type: SET_FILTER,
                      payload: {
                          filter: removeEmpty(filter),
                          displayedFilters,
                      },
                  }),
        [changeParams] // eslint-disable-line react-hooks/exhaustive-deps
    );

    const hideFilter = useCallback(
        (filterName: string) => {
            changeParams({
                type: HIDE_FILTER,
                payload: filterName,
            });
        },
        [changeParams]
    );

    const showFilter = useCallback(
        (filterName: string, defaultValue: any) => {
            changeParams({
                type: SHOW_FILTER,
                payload: {
                    filterName,
                    defaultValue,
                },
            });
        },
        [changeParams]
    );

    return [
        {
            filterValues,
            requestSignature,
            ...query,
            displayedFilters: query.displayedFilters ?? displayedFilterValues,
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

const parseObject = (query, field) => {
    if (query[field] && typeof query[field] === 'string') {
        try {
            query[field] = JSON.parse(query[field]);
        } catch (err) {
            delete query[field];
        }
    }
};

export const parseQueryFromLocation = ({ search }): Partial<ListParams> => {
    const query = pickBy(
        parse(search),
        (v, k) => validQueryParams.indexOf(k) !== -1
    );
    parseObject(query, 'filter');
    parseObject(query, 'displayedFilters');
    return query;
};

/**
 * Check if user has already set custom sort, page, or filters for this list
 *
 * User params come from the store as the params props. By default,
 * this object is:
 *
 * { filter: {}, order: null, page: 1, perPage: null, sort: null }
 *
 * To check if the user has custom params, we must compare the params
 * to these initial values.
 *
 * @param {Object} params
 */
export const hasCustomParams = (params: ListParams) => {
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

/**
 * Merge list params from 3 different sources:
 *   - the query string
 *   - the params stored in the state (from previous navigation)
 *   - the props passed to the List component (including the filter defaultValues)
 */
export const getQuery = ({
    queryFromLocation,
    params,
    filterDefaultValues,
    sort,
    perPage,
}) => {
    const query: Partial<ListParams> =
        Object.keys(queryFromLocation).length > 0
            ? queryFromLocation
            : hasCustomParams(params)
            ? { ...params }
            : { filter: filterDefaultValues || {} };

    if (!query.sort) {
        query.sort = sort.field;
        query.order = sort.order;
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
    } as ListParams;
};

export const getNumberOrDefault = (
    possibleNumber: string | number | undefined,
    defaultValue: number
) => {
    const parsedNumber =
        typeof possibleNumber === 'string'
            ? parseInt(possibleNumber, 10)
            : possibleNumber;

    return parsedNumber === undefined || isNaN(parsedNumber)
        ? defaultValue
        : parsedNumber;
};

export interface ListParamsOptions {
    resource: string;
    perPage?: number;
    sort?: SortPayload;
    // default value for a filter when displayed but not yet set
    filterDefaultValues?: FilterPayload;
    debounce?: number;
    // Whether to disable the synchronization of the list parameters with
    // the current location (URL search parameters)
    disableSyncWithLocation?: boolean;
}

interface Parameters extends ListParams {
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
