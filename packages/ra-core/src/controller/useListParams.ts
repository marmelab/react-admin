import { useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { parse, stringify } from 'query-string';
import lodashDebounce from 'lodash/debounce';
import pickBy from 'lodash/pickBy';
import { useHistory, useLocation } from 'react-router-dom';

import queryReducer, {
    SET_FILTER,
    HIDE_FILTER,
    SHOW_FILTER,
    SET_PAGE,
    SET_PER_PAGE,
    SET_SORT,
    SORT_ASC,
} from '../reducer/admin/resource/list/queryReducer';
import { changeListParams, ListParams } from '../actions/listActions';
import { SortPayload, ReduxState, FilterPayload } from '../types';
import removeEmpty from '../util/removeEmpty';

interface ListParamsOptions {
    resource: string;
    perPage?: number;
    sort?: SortPayload;
    // default value for a filter when displayed but not yet set
    filterDefaultValues?: FilterPayload;
    debounce?: number;
    // Whether to synchronize the list parameters with the current location (URL search parameters)
    // This is set to true automatically when a List is used inside a Resource component
    syncWithLocation?: boolean;
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
    setSort: (sort: string, order?: string) => void;
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
const useListParams = ({
    resource,
    filterDefaultValues,
    sort = defaultSort,
    perPage = 10,
    debounce = 500,
    syncWithLocation = false,
}: ListParamsOptions): [Parameters, Modifiers] => {
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [localParams, setLocalParams] = useState(defaultParams);
    const params = useSelector(
        (reduxState: ReduxState) =>
            reduxState.admin.resources[resource]
                ? reduxState.admin.resources[resource].list.params
                : defaultParams,
        shallowEqual
    );
    const tempParams = useRef<ListParams>();

    const requestSignature = [
        location.search,
        resource,
        syncWithLocation ? params : localParams,
        filterDefaultValues,
        JSON.stringify(sort),
        perPage,
        syncWithLocation,
    ];

    const queryFromLocation = syncWithLocation
        ? parseQueryFromLocation(location)
        : {};

    const query = useMemo(
        () =>
            getQuery({
                queryFromLocation,
                params: syncWithLocation ? params : localParams,
                filterDefaultValues,
                sort,
                perPage,
            }),
        requestSignature // eslint-disable-line react-hooks/exhaustive-deps
    );

    // if the location includes params (for example from a link like
    // the categories products on the demo), we need to persist them in the
    // redux state as well so that we don't lose them after a redirection back
    // to the list
    useEffect(() => {
        if (Object.keys(queryFromLocation).length > 0) {
            dispatch(changeListParams(resource, query));
        }
    }, [location.search]); // eslint-disable-line

    const changeParams = useCallback(action => {
        if (!tempParams.current) {
            // no other changeParams action dispatched this tick
            tempParams.current = queryReducer(query, action);
            // schedule side effects for next tick
            setTimeout(() => {
                if (syncWithLocation) {
                    history.push({
                        search: `?${stringify({
                            ...tempParams.current,
                            filter: JSON.stringify(tempParams.current.filter),
                            displayedFilters: JSON.stringify(
                                tempParams.current.displayedFilters
                            ),
                        })}`,
                        state: { _scrollToTop: action.type === SET_PAGE },
                    });
                    // the useEffect above will apply the changes to the params in the redux state
                } else {
                    setLocalParams(tempParams.current);
                }
                tempParams.current = undefined;
            }, 0);
        } else {
            // side effects already scheduled, just change the params
            tempParams.current = queryReducer(tempParams.current, action);
        }
    }, requestSignature); // eslint-disable-line react-hooks/exhaustive-deps

    const setSort = useCallback(
        (sort: string, order?: string) =>
            changeParams({
                type: SET_SORT,
                payload: { sort, order },
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

    return isNaN(parsedNumber) ? defaultValue : parsedNumber;
};

export default useListParams;
