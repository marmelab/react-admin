import React from 'react';
import { render, RenderResult } from 'react-testing-library';

import renderWithRedux, { RenderWithReduxResult } from './renderWithRedux';

const TestHook = ({ children, hook }) => {
    return children(hook());
};

interface RenderHookResult extends RenderResult {
    hookValue: any;
    childrenMock: jest.Mock;
    rerender: (f: any) => any;
}
interface RenderHookWithReduxResult extends RenderWithReduxResult {
    hookValue: any;
    childrenMock: jest.Mock;
    rerender: (f: any) => any;
}

function renderHook(
    hook: Function,
    withRedux?: true,
    reduxState?: {}
): RenderHookWithReduxResult;
function renderHook(hook: Function, withRedux: false): RenderHookResult;
function renderHook(hook, withRedux = true, reduxState?) {
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

export default renderHook;
