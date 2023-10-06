import { Reducer } from 'react';
import set from 'lodash/set';

import removeEmpty from '../../util/removeEmpty';
import removeKey from '../../util/removeKey';
import { ListParams } from './useListParams';

export const SET_SORT = 'SET_SORT';
export const SORT_ASC = 'ASC';
export const SORT_DESC = 'DESC';

export const SET_PAGE = 'SET_PAGE';
export const SET_PER_PAGE = 'SET_PER_PAGE';

export const SET_FILTER = 'SET_FILTER';
export const SHOW_FILTER = 'SHOW_FILTER';
export const HIDE_FILTER = 'HIDE_FILTER';

export const SET_PARAMS = 'SET_PARAMS';

const oppositeOrder = (direction: OrderBy) =>
    direction === SORT_DESC ? SORT_ASC : SORT_DESC;

type SetSortActionType = {
    type: typeof SET_SORT;
    payload: {
        field: string;
        order?: OrderBy;
    };
};

type SetPageActionType = {
    type: typeof SET_PAGE;
    payload: number;
};

type SetPerPageActionType = {
    type: typeof SET_PER_PAGE;
    payload: number;
};

type SetParamsActionType = {
    type: typeof SET_PARAMS;
    payload: {
        sort: {
            field: string;
            order?: OrderBy;
        };
        page: number;
        perPage: number;
    };
};

type ActionTypes =
    | SetSortActionType
    | SetPageActionType
    | SetPerPageActionType
    | {
          type: typeof SET_FILTER;
          payload: {
              filter: any;
              displayedFilters?: { [key: string]: boolean };
          };
      }
    | {
          type: typeof SHOW_FILTER;
          payload: { filterName: string; defaultValue?: any };
      }
    | {
          type: typeof HIDE_FILTER;
          payload: string;
      }
    | SetParamsActionType;

const setSort = (
    previousState: ListParams,
    action: SetSortActionType
): ListParams => {
    if (action.payload.field === previousState.sort) {
        return {
            ...previousState,
            order: oppositeOrder(previousState.order),
            page: 1,
        };
    }

    return {
        ...previousState,
        sort: action.payload.field,
        order: action.payload.order || SORT_ASC,
        page: 1,
    };
};

const setPage = (
    previousState: ListParams,
    action: SetPageActionType
): ListParams => {
    return { ...previousState, page: action.payload };
};

const setPerPage = (
    previousState: ListParams,
    action: SetPerPageActionType
): ListParams => {
    return { ...previousState, page: 1, perPage: action.payload };
};

const setParams = (
    previousState: ListParams,
    action: SetParamsActionType
): ListParams => {
    const { page, perPage, sort } = action.payload;
    let newState = previousState;
    if (!!perPage) {
        newState = setPerPage(previousState, {
            type: SET_PER_PAGE,
            payload: perPage,
        });
    }
    if (!!page) {
        newState = setPage(previousState, { type: SET_PAGE, payload: page });
    }
    if (!!sort) {
        newState = setSort(previousState, { type: SET_SORT, payload: sort });
    }
    return newState;
};

/**
 * This reducer is for the react-router query string.
 */
export const queryReducer: Reducer<ListParams, ActionTypes> = (
    previousState,
    action
) => {
    switch (action.type) {
        case SET_SORT:
            return setSort(previousState, action);

        case SET_PAGE:
            return setPage(previousState, action);

        case SET_PER_PAGE:
            return setPerPage(previousState, action);

        case SET_FILTER: {
            return {
                ...previousState,
                page: 1,
                filter: action.payload.filter,
                displayedFilters: action.payload.displayedFilters
                    ? action.payload.displayedFilters
                    : previousState.displayedFilters,
            };
        }

        case SHOW_FILTER: {
            if (
                previousState.displayedFilters &&
                previousState.displayedFilters[action.payload.filterName]
            ) {
                // the filter is already shown
                return previousState;
            }
            return {
                ...previousState,
                filter:
                    typeof action.payload.defaultValue !== 'undefined'
                        ? set(
                              previousState.filter,
                              action.payload.filterName,
                              action.payload.defaultValue
                          )
                        : previousState.filter,
                // we don't use lodash.set() for displayed filters
                // to avoid problems with compound filter names (e.g. 'author.name')
                displayedFilters: {
                    ...previousState.displayedFilters,
                    [action.payload.filterName]: true,
                },
            };
        }

        case HIDE_FILTER: {
            return {
                ...previousState,
                filter: removeEmpty(
                    removeKey(previousState.filter, action.payload)
                ),
                // we don't use lodash.set() for displayed filters
                // to avoid problems with compound filter names (e.g. 'author.name')
                displayedFilters: previousState.displayedFilters
                    ? Object.keys(previousState.displayedFilters).reduce(
                          (filters, filter) => {
                              return filter !== action.payload
                                  ? { ...filters, [filter]: true }
                                  : filters;
                          },
                          {}
                      )
                    : previousState.displayedFilters,
            };
        }

        case SET_PARAMS:
            return setParams(previousState, action);

        default:
            return previousState;
    }
};

type OrderBy = 'ASC' | 'DESC';

export default queryReducer;
