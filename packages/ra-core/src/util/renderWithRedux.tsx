import React from 'react';
import { render } from 'react-testing-library';

import TestContext from './TestContext';

export default (component, initialState) => {
    let dispatch;
    const renderResult = render(
        <TestContext store={initialState}>
            {({ store }) => {
                dispatch = jest.spyOn(store, 'dispatch');
                return component;
            }}
        </TestContext>
    );

    return {
        ...renderResult,
        dispatch,
    };
};
