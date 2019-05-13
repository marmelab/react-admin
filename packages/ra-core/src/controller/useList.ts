import { useCallback, useEffect } from 'react';
// @ts-ignore
import { useSelector, useDispatch } from 'react-redux';
import { parse, stringify } from 'query-string';
import { push } from 'connected-react-router';
import pickBy from 'lodash/pickBy';

import queryReducer, {
    SET_SORT,
    SET_PAGE,
    SET_PER_PAGE,
    SORT_ASC,
} from '../reducer/admin/resource/list/queryReducer';
import { crudGetList } from '../actions/dataActions';
import { changeListParams, ListParams } from '../actions/listActions';
import { Sort, ReduxState, Identifier, RecordMap } from '../types';
import { Location } from 'history';

interface Props {
    filter?: object;
    filterDefaultValues?: object;
    perPage?: number;
    sort?: Sort;
    location: Location;
    resource: string;
}

interface Query extends ListParams {
    data: RecordMap;
    ids: Identifier[];
    total: number;
    requestSignature: any[];
}

interface Actions {
    changeParams: (action: any) => void;
    setPage: (page: number) => void;
    setPerPage: (pageSize: number) => void;
    setSort: (sort: Sort) => void;
}

const useList = ({
    resource,
    location,
    filterDefaultValues,
    sort = {
        field: 'id',
        order: SORT_ASC,
    },
    perPage = 10,
    filter,
}: Props): [Query, Actions] => {
    const dispatch = useDispatch();

    const { params, ids, total } = useSelector(
        (reduxState: ReduxState) => reduxState.admin.resources[resource].list,
        [resource]
    );

    const data = useSelector(
        (reduxState: ReduxState) => reduxState.admin.resources[resource].data,
        [resource]
    );

    const query = getQuery({
        location,
        params,
        filterDefaultValues,
        sort,
        perPage,
    });

    const requestSignature = [
        resource,
        JSON.stringify(query),
        JSON.stringify(location),
    ];

    const changeParams = useCallback(action => {
        const newParams = queryReducer(query, action);
        dispatch(
            push({
                ...location,
                search: `?${stringify({
                    ...newParams,
                    filter: JSON.stringify(newParams.filter),
                })}`,
            })
        );
        dispatch(changeListParams(resource, newParams));
    }, requestSignature);

    const setSort = useCallback(
        newSort => changeParams({ type: SET_SORT, payload: { sort: newSort } }),
        requestSignature
    );

    const setPage = useCallback(
        newPage => changeParams({ type: SET_PAGE, payload: newPage }),
        requestSignature
    );

    const setPerPage = useCallback(
        newPerPage => changeParams({ type: SET_PER_PAGE, payload: newPerPage }),
        requestSignature
    );

    if (!query.page && !(ids || []).length && params.page > 1 && total > 0) {
        setPage(params.page - 1);
    }

    useEffect(() => {
        const pagination = {
            page: query.page,
            perPage: query.perPage,
        };
        const permanentFilter = filter;
        dispatch(
            crudGetList(
                resource,
                pagination,
                { field: query.sort, order: query.order },
                { ...query.filter, ...permanentFilter }
            )
        );
    }, requestSignature);

    return [
        {
            data,
            ids,
            total,
            requestSignature,
            ...query,
        },
        {
            changeParams,
            setPage,
            setPerPage,
            setSort,
        },
    ];
};

export const validQueryParams = ['page', 'perPage', 'sort', 'order', 'filter'];

export const parseQueryFromLocation = ({ search }) => {
    const query = pickBy(
        parse(search),
        (v, k) => validQueryParams.indexOf(k) !== -1
    );
    if (query.filter && typeof query.filter === 'string') {
        try {
            query.filter = JSON.parse(query.filter);
        } catch (err) {
            delete query.filter;
        }
    }
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
 * @param {object} params
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
    location,
    params,
    filterDefaultValues,
    sort,
    perPage,
}) => {
    const queryFromLocation = parseQueryFromLocation(location);
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
    if (!query.perPage) {
        query.perPage = perPage;
    }
    if (!query.page) {
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
) =>
    (typeof possibleNumber === 'string'
        ? parseInt(possibleNumber, 10)
        : possibleNumber) || defaultValue;

export default useList;
