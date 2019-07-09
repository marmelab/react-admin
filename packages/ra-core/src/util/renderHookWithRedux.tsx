import React from 'react';
import renderWithRedux from './renderWithRedux';

const TestHook = ({ children, hook }) => {
    return children(hook());
};
export default (hook, reduxState?) => {
    let hookValue = null;
    const children = props => {
        hookValue = props;
        return <p>child</p>;
    };
    const result = renderWithRedux(
        <TestHook children={children} hook={hook} />,
        reduxState
    );

    return {
        ...result,
        hookValue,
        rerender: newHook => {
            return result.rerender(
                <TestHook children={children} hook={newHook} />
            );
        },
    };
};
