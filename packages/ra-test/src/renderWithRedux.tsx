import * as React from 'react';
import { render, RenderResult } from '@testing-library/react';

import TestContext from './TestContext';

export interface RenderWithReduxResult extends RenderResult {
    dispatch: jest.Mock;
    reduxStore: any;
}

/**
 * render with react-testing library adding redux context for unit test.
 * @example
 * const { dispatch, reduxStore, ...otherReactTestingLibraryHelper } = renderWithRedux(
 *     <TestedComponent />,
 *     initialState
 * );
 *
 * render with react-testing library adding redux context for unit test and passing customReducers.
 * @example
 * const { dispatch, reduxStore, ...otherReactTestingLibraryHelper } = renderWithRedux(
 *     <TestedComponent />,
 *     initialState,
 *     {},
 *     customReducers
 * );
 *
 * @param {ReactNode} component: The component you want to test in jsx
 * @param {Object} initialState: Optional initial state of the redux store
 * @param {Object} options: Render options, e.g. to use a custom container element
 * @param {Object} customReducers: Custom reducers to be added to the default store
 * @return {{ dispatch, reduxStore, ...rest }} helper function to test rendered component.
 * Same as @testing-library/react render method with added dispatch and reduxStore helper
 * dispatch: spy on the redux store dispatch method
 * reduxStore: the redux store used by the tested component
 */
export const renderWithRedux = (
    component,
    initialState = {},
    options = {},
    customReducers = {}
): RenderWithReduxResult => {
    let dispatch;
    let reduxStore;
    const renderResult = render(
        <TestContext
            initialState={initialState}
            customReducers={customReducers}
            enableReducers
        >
            {({ store }) => {
                dispatch = jest.spyOn(store, 'dispatch');
                reduxStore = store;
                return component;
            }}
        </TestContext>,
        options
    );

    return {
        ...renderResult,
        rerender: newComponent => {
            return renderResult.rerender(
                <TestContext
                    initialState={initialState}
                    customReducers={customReducers}
                    enableReducers
                >
                    {({ store }) => {
                        dispatch = jest.spyOn(store, 'dispatch');
                        reduxStore = store;
                        return newComponent;
                    }}
                </TestContext>
            );
        },
        dispatch,
        reduxStore,
    };
};
