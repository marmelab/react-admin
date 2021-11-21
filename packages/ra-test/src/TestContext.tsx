import * as React from 'react';
import { useRef, ReactNode } from 'react';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import merge from 'lodash/merge';
import { createMemoryHistory, History } from 'history';
import { Router } from 'react-router-dom';

import { createAdminStore, ReduxState } from 'ra-core';

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
export const TestContext = (props: TestContextProps) => {
    const {
        initialState = {},
        enableReducers = false,
        customReducers = {},
    } = props;
    const history = useRef<History>(props.history || createMemoryHistory());
    const storeWithDefault = useRef<Store<ReduxState>>(
        enableReducers
            ? createAdminStore({
                  initialState: merge({}, defaultStore, initialState),
                  customReducers,
              })
            : createStore(() => merge({}, defaultStore, initialState))
    );

    const renderChildren = () => {
        const { children } = props;
        return typeof children === 'function'
            ? (children as TextContextChildrenFunction)({
                  store: storeWithDefault.current,
                  history: history.current,
              })
            : children;
    };

    return (
        <Provider store={storeWithDefault.current}>
            <Router history={history.current}>{renderChildren()}</Router>
        </Provider>
    );
};

export default TestContext;
