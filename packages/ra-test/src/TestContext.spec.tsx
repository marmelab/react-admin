import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { showNotification } from 'ra-core';
import TestContext, { defaultStore } from './TestContext';
import { WithDataProvider } from './TestContext.stories';

const primedStore = {
    admin: {
        notifications: [],
        resources: {},
        ui: {},
        selectedIds: {},
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
            expect(testStore.getState()).toEqual(primedStore);

            testStore.dispatch(showNotification('here'));

            expect(testStore.getState()).toEqual({
                ...primedStore,
                admin: {
                    ...primedStore.admin,
                    notifications: [{ message: 'here', type: 'info' }],
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

            testStore.dispatch(showNotification('here'));

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

            expect(testStore.getState()).toEqual({
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

            expect(testStore.getState()).toEqual({
                ...primedStore,
                customReducer: {
                    ...customReducerInitialState,
                    foo: testValue,
                },
            });
        });

        it('should work with useDataProvider actions', async () => {
            render(<WithDataProvider />);
            expect(screen.getByText('loading')).toBeDefined();
            await screen.findByText('foo');
        });
    });
});
