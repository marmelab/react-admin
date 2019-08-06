import React from 'react';
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
 * @param {ReactNode} component: The component you want to test in jsx
 * @param {Object} initialstate: Optional initial state of the redux store
 * @return {{ dispatch, reduxStore, ...rest }} helper function to test rendered component.
 * Same as @testing-library/react render method with added dispatch and reduxStore helper
 * dispatch: spy on the redux stroe dispatch method
 * reduxStore: the redux store used by the tested component
 */
export default (component, initialState = {}): RenderWithReduxResult => {
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
        rerender: newComponent => {
            return renderResult.rerender(
                <TestContext initialState={initialState} enableReducers>
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
