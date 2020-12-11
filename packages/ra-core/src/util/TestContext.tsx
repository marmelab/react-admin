import * as React from 'react';
import { Component, ReactNode } from 'react';
import { createStore, Store } from 'redux';
import { Provider } from 'react-redux';
import merge from 'lodash/merge';
import { createMemoryHistory, History } from 'history';
import { Router } from 'react-router-dom';

import createAdminStore from '../core/createAdminStore';
import { convertLegacyDataProvider } from '../dataProvider';
import { ReduxState } from '../types';

export const defaultStore = {
    admin: {
        resources: {},
        references: { possibleValues: {} },
        ui: { viewVersion: 1 },
        notifications: [],
    },
};

type ChildrenFunction = ({
    store,
    history,
}: {
    store: Store<ReduxState>;
    history: History;
}) => ReactNode;

interface Props {
    initialState?: object;
    enableReducers?: boolean;
    children: ReactNode | ChildrenFunction;
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
    history: History = null;

    constructor(props) {
        super(props);
        this.history = props.history || createMemoryHistory();
        const { initialState = {}, enableReducers = false } = props;

        this.storeWithDefault = enableReducers
            ? createAdminStore({
                  initialState: merge({}, defaultStore, initialState),
                  dataProvider: convertLegacyDataProvider(() =>
                      Promise.resolve(dataProviderDefaultResponse)
                  ),
                  history: createMemoryHistory(),
              })
            : createStore(() => merge({}, defaultStore, initialState));
    }

    renderChildren = () => {
        const { children } = this.props;
        return typeof children === 'function'
            ? (children as ChildrenFunction)({
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
