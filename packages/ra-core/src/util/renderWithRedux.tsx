import React from 'react';
import { render } from 'react-testing-library';

import TestContext from './TestContext';

export default (component, initialState = {}) => {
    let dispatch;
    let reduxStore;
    const renderResult = render(
        <TestContext initialState={initialState} enableReducers>
            {({ store }) => {
                dispatch = jest.spyOn(store, 'dispatch');
                reduxStore = store;
                return component;
            }}
        </TestContext>
    );

    return {
        ...renderResult,
        dispatch,
        reduxStore,
    };
};
