import * as React from 'react';
import { render, RenderResult } from '@testing-library/react';

import { renderWithRedux, RenderWithReduxResult } from './renderWithRedux';

const TestHook = ({ children, hook }) => {
    return children(hook());
};

export interface RenderHookResult extends RenderResult {
    hookValue: any;
    childrenMock: jest.Mock;
    rerender: (f: any) => any;
}
export interface RenderHookWithReduxResult extends RenderWithReduxResult {
    hookValue: any;
    childrenMock: jest.Mock;
    rerender: (f: any) => any;
}

/**
 * render given hook using @testing-library/react and return hook value
 * @param hook the hook to render
 * @param withRedux should we provide a redux context default to true
 * @param reduxState optional initial state for redux context
 *
 * @returns {RenderHookResult}
 * @returns {RenderHookWithReduxResult}
 */
export function renderHook(
    hook: Function,
    withRedux?: true,
    reduxState?: {}
): RenderHookWithReduxResult;
export function renderHook(hook: Function, withRedux: false): RenderHookResult;
export function renderHook(hook, withRedux = true, reduxState?) {
    let hookValue = null;
    const children = props => {
        hookValue = props;
        return <p>child</p>;
    };
    const childrenMock = jest.fn().mockImplementation(children);
    const result = withRedux
        ? renderWithRedux(
              <TestHook children={childrenMock} hook={hook} />,
              reduxState
          )
        : render(<TestHook children={childrenMock} hook={hook} />);

    return {
        ...result,
        hookValue,
        childrenMock,
        rerender: newHook => {
            result.rerender(
                <TestHook children={childrenMock} hook={newHook} />
            );
        },
    };
}
