import React from 'react';
import renderWithRedux from './renderWithRedux';

const TestHook = ({ children, hookProps }) => {
    return children(hookProps());
};
export default (hookProps, reduxState?) => {
    let childrenProps = null;
    const children = props => {
        childrenProps = props;
        return <p>child</p>;
    };
    const result = renderWithRedux(
        <TestHook children={children} hookProps={hookProps} />,
        reduxState
    );

    return {
        ...result,
        childrenProps,
        rerender: newHook => {
            return result.rerender(
                <TestHook children={children} hookProps={newHook} />
            );
        },
    };
};
