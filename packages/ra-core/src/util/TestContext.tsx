import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import TranslationProvider from '../i18n/TranslationProvider';
import merge from 'lodash/merge';
import { createMemoryHistory } from 'history';

import defaultI18nProvider from '../i18n/defaultI18nProvider';
import createAdminStore from '../createAdminStore';
import { I18nProvider } from '../types';

export const defaultStore = {
    admin: {
        resources: {},
        references: { possibleValues: {} },
        ui: { viewVersion: 1 },
    },
};

interface Props {
    initialState?: object;
    i18nProvider?: I18nProvider;
    enableReducers?: boolean;
}

const dataProviderDefaultResponse = { data: null };

/**
 * Simulate a react-admin context in unit tests
 *
 * Pass custom store values as store prop
 *
 * @example
 * // in an enzyme test
 * const wrapper = render(
 *     <TestContext initialState={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         <Show {...defaultShowProps} />
 *     </TestContext>
 * );
 *
 * @example
 * // in an enzyme test, using jest.
 * const wrapper = render(
 *     <TestContext initialState={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
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
        const { initialState = {}, enableReducers = false } = props;

        this.storeWithDefault = enableReducers
            ? createAdminStore({
                  initialState: merge({}, defaultStore, initialState),
                  dataProvider: () =>
                      Promise.resolve(dataProviderDefaultResponse),
                  history: createMemoryHistory(),
              })
            : createStore(() => merge({}, defaultStore, initialState));
    }

    renderChildren = () => {
        const { children } = this.props;
        return typeof children === 'function'
            ? children({ store: this.storeWithDefault })
            : children;
    };

    render() {
        const { i18nProvider = defaultI18nProvider } = this.props;
        return (
            <Provider store={this.storeWithDefault}>
                <TranslationProvider i18nProvider={i18nProvider}>
                    {this.renderChildren()}
                </TranslationProvider>
            </Provider>
        );
    }
}

export default TestContext;
