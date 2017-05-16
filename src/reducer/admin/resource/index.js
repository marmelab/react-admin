import { combineReducers } from 'redux';
import data, * as dataSelectors from './data';
import list, * as listSelectors from './list';

export default (resource) => combineReducers({
    data: data(resource),
    list: list(resource),
});

export const getData = (state) => state.data;
export const getRecord = (state) => (id) => dataSelectors.getRecord(getData(state), id);

export const getList = (state) => state.list;
export const getListWithFiltersValues = (state) => {
  const list = getList(state);

  return {
    ...list,
    filterValues: listSelectors.getFilterValues(list),
  };
};
