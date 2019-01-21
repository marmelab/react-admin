import React, { SFC } from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import TranslationProvider from '../i18n/TranslationProvider';
import merge from 'lodash/merge';
import { createMemoryHistory } from 'history';

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

interface Props {
    store?: object;
    enableReducers?: boolean;
}

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
const TestContext: SFC<Props> = ({
    store = {},
    enableReducers = false,
    children,
}) => {
    const storeWithDefault = enableReducers
        ? createAdminStore({
              initialState: merge(defaultStore, store),
              dataProvider: () => Promise.resolve({}),
              history: createMemoryHistory(),
          })
        : createStore(() => merge(defaultStore, store));

    const renderChildren = () =>
        typeof children === 'function'
            ? children({ store: storeWithDefault })
            : children;

    return (
        <Provider store={storeWithDefault}>
            <TranslationProvider>{renderChildren()}</TranslationProvider>
        </Provider>
    );
};

export default TestContext;
