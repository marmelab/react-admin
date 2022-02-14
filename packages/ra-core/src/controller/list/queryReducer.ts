import { Reducer } from 'react';

import { ListParams } from './useListParams';
import { FilterItem } from '../../types';

export const SET_SORT = 'SET_SORT';
export const SORT_ASC = 'ASC';
export const SORT_DESC = 'DESC';

export const SET_PAGE = 'SET_PAGE';
export const SET_PER_PAGE = 'SET_PER_PAGE';

export const SET_FILTERS = 'SET_FILTERS';
export const SHOW_FILTER = 'SHOW_FILTER';
export const HIDE_FILTER = 'HIDE_FILTER';

const oppositeOrder = direction =>
    direction === SORT_DESC ? SORT_ASC : SORT_DESC;

type ActionTypes =
    | {
          type: typeof SET_SORT;
          payload: {
              field: string;
              order?: typeof SORT_ASC | typeof SORT_DESC;
          };
      }
    | {
          type: typeof SET_PAGE;
          payload: number;
      }
    | {
          type: typeof SET_PER_PAGE;
          payload: number;
      }
    | {
          type: typeof SET_FILTERS;
          payload: {
              filters: FilterItem[];
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
      };

/**
 * This reducer is for the react-router query string.
 */
export const queryReducer: Reducer<Partial<ListParams>, ActionTypes> = (
    previousState,
    action
) => {
    switch (action.type) {
        case SET_SORT:
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

        case SET_PAGE:
            return { ...previousState, page: action.payload };

        case SET_PER_PAGE:
            return { ...previousState, page: 1, perPage: action.payload };

        case SET_FILTERS: {
            return {
                ...previousState,
                page: 1,
                filters: action.payload.filters,
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
                filters:
                    typeof action.payload.defaultValue !== 'undefined'
                        ? [
                              ...previousState.filters,
                              {
                                  field: action.payload.filterName,
                                  value: action.payload.defaultValue,
                              },
                          ]
                        : previousState.filters,
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
                filters: previousState.filters.filter(
                    f => f.field !== action.payload
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
            return previousState;
    }
};

export default queryReducer;
