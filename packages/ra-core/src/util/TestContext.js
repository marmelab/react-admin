import React from 'react';
import PropTypes from 'prop-types';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import { TranslationProvider } from 'ra-core';
import merge from 'lodash/merge';

import createAdminStore from '../createAdminStore';

export const defaultStore = {
  admin: {
    resources: {},
    references: { possibleValues: {} },
    ui: { viewVersion: 1 },
  },
  form: formReducer(),
  i18n: { locale: 'en', messages: {} },
};

/**
 * Simulate a react-admin context in unit tests
 *
 * Pass custom store values as store prop
 *
 * @example
 * // in an enzyme test
 * const wrapper = render(
 *     <AdminContext store={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         <Show {...defaultShowProps} />
 *     </AdminContext>
 * );
 *
 * @example
 * // in an enzyme test, using jest.
 * const wrapper = render(
 *     <AdminContext store={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         {({ store }) => {
 *              dispatchSpy = jest.spyOn(store, 'dispatch');
 *              return <Show {...defaultShowProps} />
 *         }}
 *     </AdminContext>
 * );
 */
const TestContext = ({ store, enableReducers, children }) => {
  const storeWithDefault = enableReducers
    ? createAdminStore({ initialState: merge(defaultStore, store) })
    : createStore(() => merge(defaultStore, store));

  const renderChildren = () => (typeof children === 'function' ? children({ store: storeWithDefault }) : children);

  return (
    <Provider store={storeWithDefault}>
      <TranslationProvider>{renderChildren()}</TranslationProvider>
    </Provider>
  );
};

TestContext.propTypes = {
  store: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  enableReducers: PropTypes.bool,
};

TestContext.defaultProps = {
  store: {},
  enableReducers: false,
};

export default TestContext;
