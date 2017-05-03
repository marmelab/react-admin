import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';
import adminReducer, * as adminSelectors from './admin';
import localeReducer from './locale';

export default (resources, customReducers, locale) => combineReducers({
    admin: adminReducer(resources),
    locale: localeReducer(locale),
    form: formReducer,
    routing: routerReducer,
    ...customReducers,
});

export const getAdmin = (state) => state.admin;
export const getResource = (state) => adminSelectors.getResource(getAdmin(state));
export const getResourceData = (state) => adminSelectors.getResourceData(getAdmin(state));
export const getResourceRecord = (state) => adminSelectors.getResourceRecord(getAdmin(state));
export const isLoading = (state) => adminSelectors.isLoading(getAdmin(state));
export const getPossibleReferences = (state) => adminSelectors.getPossibleReferences(getAdmin(state));

export const getIdsRelatedTo = (state) => adminSelectors.getIdsRelatedTo(getAdmin(state));
export const getReferencesFromIds = (state) => (ids) => (reference) => {
  if (typeof ids === 'undefined') return undefined;

  const data = getResourceData(state)(reference);

  return ids
    .map(id => data[id])
    .filter(r => typeof r !== 'undefined')
    .reduce((prev, record) => {
      prev[record.id] = record; // eslint-disable-line no-param-reassign
      return prev;
    }, {});
};