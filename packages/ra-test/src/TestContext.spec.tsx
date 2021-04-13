import expect from 'expect';
import { render } from '@testing-library/react';
import * as React from 'react';

import TestContext, { defaultStore } from './TestContext';
import { refreshView } from 'ra-core';

const primedStore = {
    admin: {
        loading: 0,
        notifications: [],
        references: {
            oneToMany: {},
            possibleValues: {},
        },
        resources: {},
        ui: {
            viewVersion: 1,
        },
        customQueries: {},
    },
    router: {
        action: 'POP',
        location: {
            hash: '',
            key: '',
            pathname: '/',
            query: {},
            search: '',
            state: undefined,
        },
    },
};

const CHANGE_FOO = 'CHANGE_FOO';

const customReducerInitialState = {
    foo: 'bar',
    foo2: 'bar2',
};

const customAction = payload => ({
    type: CHANGE_FOO,
    payload,
});

const customReducer = (prevState = customReducerInitialState, action) => {
    switch (action.type) {
        case CHANGE_FOO:
            return {
                ...prevState,
                foo: action.payload,
            };
        default:
            return prevState;
    }
};

const eraseRouterKey = state => {
    state.router.location.key = ''; // react-router initializes the state with a random key
    return state;
};

describe('TestContext.js', () => {
    it('should render the given children', () => {
        const { queryAllByText } = render(
            <TestContext>
                <span>foo</span>
            </TestContext>
        );
        expect(queryAllByText('foo')).toHaveLength(1);
    });

    it('should return a default store as a renderProp', () => {
        let testStore;
        render(
            <TestContext>
                {({ store }) => {
                    testStore = store;
                    return <span>foo</span>;
                }}
            </TestContext>
        );

        expect(testStore).toBeInstanceOf(Object);
        expect(testStore.dispatch).toBeInstanceOf(Function);
        expect(testStore.getState()).toEqual(defaultStore);
    });

    describe('enableReducers options', () => {
        it('should update the state when set to TRUE', () => {
            let testStore;
            render(
                <TestContext enableReducers={true}>
                    {({ store }) => {
                        testStore = store;
                        return <span>foo</span>;
                    }}
                </TestContext>
            );
            const initialstate = eraseRouterKey(testStore.getState());
            expect(initialstate).toEqual(primedStore);

            testStore.dispatch(refreshView());

            expect(testStore.getState()).toEqual({
                ...primedStore,
                admin: {
                    ...primedStore.admin,
                    ui: {
                        ...primedStore.admin.ui,
                        viewVersion: 2,
                    },
                },
            });
        });

        it('should NOT update the state when set to FALSE (default)', () => {
            let testStore;
            render(
                <TestContext>
                    {({ store }) => {
                        testStore = store;
                        return <span>foo</span>;
                    }}
                </TestContext>
            );
            expect(testStore.getState()).toEqual(defaultStore);

            testStore.dispatch(refreshView());

            expect(testStore.getState()).toEqual(defaultStore);
        });

        it('should initilize the state with customReducers initialState', () => {
            let testStore;
            render(
                <TestContext
                    enableReducers={true}
                    customReducers={{ customReducer }}
                >
                    {({ store }) => {
                        testStore = store;
                        return <span>foo</span>;
                    }}
                </TestContext>
            );
            const initialstate = eraseRouterKey(testStore.getState());

            expect(initialstate).toEqual({
                ...primedStore,
                customReducer: customReducerInitialState,
            });
        });

        it('should update the state on customReducers action', () => {
            const testValue = 'test';
            let testStore;
            render(
                <TestContext
                    enableReducers={true}
                    customReducers={{ customReducer }}
                >
                    {({ store }) => {
                        testStore = store;
                        return <span>foo</span>;
                    }}
                </TestContext>
            );

            testStore.dispatch(customAction(testValue));
            const alteredState = eraseRouterKey(testStore.getState());

            expect(alteredState).toEqual({
                ...primedStore,
                customReducer: {
                    ...customReducerInitialState,
                    foo: testValue,
                },
            });
        });
    });
});
