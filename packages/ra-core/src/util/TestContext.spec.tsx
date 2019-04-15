import assert from 'assert';
import { shallow, mount } from 'enzyme';
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
    },
    form: {},
    i18n: {
        loading: false,
        locale: 'en',
        messages: {},
    },
    router: {
        location: null,
    },
};

describe('TestContext.js', () => {
    let testStore;

    it('should render the given children', () => {
        const component = shallow(
            <TestContext>
                <span>foo</span>
            </TestContext>
        );
        assert.equal(component.html(), '<span>foo</span>');
    });

    it('should return a default store as a renderProp', () => {
        const component = shallow(
            <TestContext>
                {({ store }) => {
                    testStore = store;
                    return <span>foo</span>;
                }}
            </TestContext>
        );
        assert.equal(component.html(), '<span>foo</span>');
        assert.equal(typeof testStore, 'object');
        assert.equal(typeof testStore.dispatch, 'function');
        assert.deepStrictEqual(testStore.getState(), defaultStore);
    });

    describe('enableReducers options', () => {
        it('should update the state when set to TRUE', () => {
            shallow(
                <TestContext enableReducers={true}>
                    {({ store }) => {
                        testStore = store;
                        return <span>foo</span>;
                    }}
                </TestContext>
            );
            assert.deepStrictEqual(testStore.getState(), primedStore);

            testStore.dispatch(submit('foo'));

            assert.deepStrictEqual(testStore.getState(), {
                ...primedStore,
                form: {
                    foo: {
                        triggerSubmit: true,
                    },
                },
            });
        });

        it('should NOT update the state when set to FALSE (default)', () => {
            shallow(
                <TestContext>
                    {({ store }) => {
                        testStore = store;
                        return <span>foo</span>;
                    }}
                </TestContext>
            );
            assert.deepStrictEqual(testStore.getState(), defaultStore);

            testStore.dispatch(submit('foo'));

            assert.deepStrictEqual(testStore.getState(), defaultStore);
        });
    });
});
