import * as React from 'react';
import { Component, ReactNode } from 'react';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import merge from 'lodash/merge';
import { createMemoryHistory, History } from 'history';
import { Router } from 'react-router-dom';

import {
    convertLegacyDataProvider,
    createAdminStore,
    ReduxState,
} from 'ra-core';

export const defaultStore = {
    admin: {
        resources: {},
        references: { possibleValues: {} },
        ui: { viewVersion: 1 },
        notifications: [],
    },
};

export type TextContextChildrenFunction = ({
    store,
    history,
}: {
    store: Store<ReduxState>;
    history: History;
}) => ReactNode;

export interface TestContextProps {
    initialState?: object;
    enableReducers?: boolean;
    history?: History;
    customReducers?: object;
    children: ReactNode | TextContextChildrenFunction;
}

const dataProviderDefaultResponse = { data: null };

/**
 * Simulate a react-admin context in unit tests
 *
 * Pass custom store values as store prop
 *
 * @example
 * // in a react testing-library test
 * const utils = render(
 *     <TestContext initialState={{ admin: { resources: { post: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         <Show {...defaultShowProps} />
 *     </TestContext>
 * );
 *
 * @example
 * // in a react testing-library test, using jest.
 * const utils = render(
 *     <TestContext initialState={{ admin: { resources: { posts: { data: { 1: {id: 1, title: 'foo' } } } } } }}>
 *         {({ store }) => {
 *              dispatchSpy = jest.spyOn(store, 'dispatch');
 *              return <Show {...defaultShowProps} />
 *         }}
 *     </TestContext>
 * );
 */
export class TestContext extends Component<TestContextProps> {
    storeWithDefault = null;
    history: History = null;

    constructor(props) {
        super(props);
        this.history = props.history || createMemoryHistory();
        const {
            initialState = {},
            enableReducers = false,
            customReducers = {},
        } = props;

        this.storeWithDefault = enableReducers
            ? createAdminStore({
                  initialState: merge({}, defaultStore, initialState),
                  dataProvider: convertLegacyDataProvider(() =>
                      Promise.resolve(dataProviderDefaultResponse)
                  ),
                  history: createMemoryHistory(),
                  customReducers,
              })
            : createStore(() => merge({}, defaultStore, initialState));
    }

    renderChildren = () => {
        const { children } = this.props;
        return typeof children === 'function'
            ? (children as TextContextChildrenFunction)({
                  store: this.storeWithDefault,
                  history: this.history,
              })
            : children;
    };

    render() {
        return (
            <Provider store={this.storeWithDefault}>
                <Router history={this.history}>{this.renderChildren()}</Router>
            </Provider>
        );
    }
}

export default TestContext;
