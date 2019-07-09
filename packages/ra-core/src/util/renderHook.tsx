import React from 'react';
import { render } from 'react-testing-library';

const TestHook = ({ children, hook }) => {
    return children(hook());
};
export default hook => {
    let hookValue = null;
    const children = props => {
        hookValue = props;
        return <p>child</p>;
    };
    const childrenMock = jest.fn().mockImplementation(children);
    const result = render(<TestHook children={childrenMock} hook={hook} />);

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
};
