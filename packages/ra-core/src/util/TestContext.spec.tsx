import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import React from 'react';
import { submit } from 'redux-form';

import TestContext, { defaultStore } from './TestContext';

const primedStore = {
    admin: {
        auth: {
            isLoggedIn: false,
        },
        loading: 0,
        notifications: [],
        record: {},
        references: {
            oneToMany: {},
            possibleValues: {},
        },
        resources: {},
        saving: false,
        ui: {
            viewVersion: 1,
        },
        customQueries: {},
    },
    form: {},
    i18n: {
        loading: false,
        locale: 'en',
        messages: {},
    },
    router: {
        action: 'POP',
        location: {
            hash: '',
            key: '',
            pathname: '/',
            search: '',
            state: undefined,
        },
    },
};

describe('TestContext.js', () => {
    afterEach(cleanup);

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
            const initialstate = testStore.getState();
            initialstate.router.location.key = ''; // react-router initializes the state with a random key
            expect(initialstate).toEqual(primedStore);

            testStore.dispatch(submit('foo'));

            expect(testStore.getState()).toEqual({
                ...primedStore,
                form: {
                    foo: {
                        triggerSubmit: true,
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

            testStore.dispatch(submit('foo'));

            expect(testStore.getState()).toEqual(defaultStore);
        });
    });
});
