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

const oppositeOrder = direction =>
    direction === SORT_DESC ? SORT_ASC : SORT_DESC;

type SetSortPayload = {
    field: string;
    order?: typeof SORT_ASC | typeof SORT_DESC;
};

type SetPagePayload = number;

type SetPerPagePayload = number;

type SetFilterPayload = {
    filter: any;
    displayedFilters?: { [key: string]: boolean };
};

type SetShowFilterPayload = { filterName: string; defaultValue?: any };

type SetHideFilterPayload = string;

type SetDefaultPayload = ListParams;

type ActionTypes =
    | {
          type: typeof SET_SORT;
          payload: SetSortPayload;
      }
    | {
          type: typeof SET_PAGE;
          payload: SetPagePayload;
      }
    | {
          type: typeof SET_PER_PAGE;
          payload: SetPerPagePayload;
      }
    | {
          type: typeof SET_FILTER;
          payload: SetFilterPayload;
      }
    | {
          type: typeof SHOW_FILTER;
          payload: SetShowFilterPayload;
      }
    | {
          type: typeof HIDE_FILTER;
          payload: SetHideFilterPayload;
      }
    | {
          type: undefined;
          payload: SetDefaultPayload;
      };

/**
 * This reducer is for the react-router query string.
 */
export const queryReducer: Reducer<ListParams, ActionTypes> = (
    previousState,
    action
): ListParams => {
    switch (action.type) {
        case SET_SORT:
            const { field } = action.payload as SetSortPayload;
            if (field === previousState.sort) {
                return {
                    ...previousState,
                    order: oppositeOrder(previousState.order),
                    page: 1,
                };
            }

            return {
                ...previousState,
                sort: field,
                order: action.payload.order || SORT_ASC,
                page: 1,
            };

        case SET_PAGE:
            return { ...previousState, page: action.payload as SetPagePayload };

        case SET_PER_PAGE:
            return {
                ...previousState,
                page: 1,
                perPage: action.payload as SetPerPagePayload,
            };

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
            const {
                filterName,
                defaultValue,
            } = action.payload as SetShowFilterPayload;
            if (
                previousState.displayedFilters &&
                previousState.displayedFilters[filterName]
            ) {
                // the filter is already shown
                return previousState;
            }
            return {
                ...previousState,
                filter:
                    typeof defaultValue !== 'undefined'
                        ? set(previousState.filter, filterName, defaultValue)
                        : previousState.filter,
                // we don't use lodash.set() for displayed filters
                // to avoid problems with compound filter names (e.g. 'author.name')
                displayedFilters: {
                    ...previousState.displayedFilters,
                    [filterName]: true,
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

        default:
            return (
                ((action as ActionTypes).payload as SetDefaultPayload) ??
                previousState
            );
    }
};

export default queryReducer;
