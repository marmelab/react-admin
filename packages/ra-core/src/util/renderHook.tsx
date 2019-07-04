import React from 'react';
import { render } from 'react-testing-library';

const TestHook = ({ children, hookProps }) => {
    return children(hookProps());
};
export default hookProps => {
    let childrenProps = null;
    const children = props => {
        childrenProps = props;
        return <p>child</p>;
    };
    const childrenMock = jest.fn().mockImplementation(children);
    const result = render(
        <TestHook children={childrenMock} hookProps={hookProps} />
    );

    return {
        ...result,
        childrenProps,
        childrenMock,
        rerender: newHook => {
            result.rerender(
                <TestHook children={childrenMock} hookProps={newHook} />
            );
        },
    };
};
