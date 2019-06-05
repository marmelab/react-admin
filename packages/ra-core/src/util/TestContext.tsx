import React, { Component } from 'react';
import { createStore } from 'redux';
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
    form: formReducer({}, { type: '@@FOO' }), // Call the reducer with an unknown type to initialize it
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
 *     <TestContext store={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         <Show {...defaultShowProps} />
 *     </TestContext>
 * );
 *
 * @example
 * // in an enzyme test, using jest.
 * const wrapper = render(
 *     <TestContext store={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         {({ store }) => {
 *              dispatchSpy = jest.spyOn(store, 'dispatch');
 *              return <Show {...defaultShowProps} />
 *         }}
 *     </TestContext>
 * );
 */
class TestContext extends Component<Props> {
    storeWithDefault = null;

    constructor(props) {
        super(props);
        const { store = {}, enableReducers = false } = props;
        this.storeWithDefault = enableReducers
            ? createAdminStore({
                  initialState: merge(defaultStore, store),
                  dataProvider: () => Promise.resolve({}),
                  history: createMemoryHistory(),
              })
            : createStore(() => merge(defaultStore, store));
    }

    renderChildren = () => {
        const { children } = this.props;
        return typeof children === 'function' ? children({ store: this.storeWithDefault }) : children;
    };

    render() {
        return (
            <Provider store={this.storeWithDefault}>
                <TranslationProvider>{this.renderChildren()}</TranslationProvider>
            </Provider>
        );
    }
}

export default TestContext;
