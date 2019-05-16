import React from 'react';
import { render } from 'react-testing-library';

import TestContext from './TestContext';

/**
 * render with react-testing library adding redux context for unit test.
 * @example
 * const { dispatch, reduxStore, ...otherReactTestingLibraryHelper } = renderWithRedux(
 *     <TestedComponent />,
 *     { initialState: data }
 * );
 *
 * @param {ReactNode} component: The component you want to test in jsx
 * @param {Object} initialstate: Optional initial state of the redux store
 * @return {{ dispatch, reduxStore, ...rest }} helper function to test rendered component.
 * Same as react-testing-library render method with added dispatch and reduxStore helper
 * dispatch: spy on the redux stroe dispatch method
 * reduxStore: the redux store used by the tested component
 */
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
