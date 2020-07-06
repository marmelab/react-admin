import * as React from 'react';
import { render, cleanup } from '@testing-library/react';
import FunctionField from './FunctionField';

describe('<FunctionField />', () => {
    afterEach(cleanup);

    it('should render using the render function', () => {
        const record = { id: 123, foo: 'bar' };
        const { queryByText } = render(
            <FunctionField
                record={record}
                render={r => r && r.foo.substr(0, 2)}
            />
        );
        expect(queryByText('ba')).not.toBeNull();
    });

    it('should use custom className', () => {
        const { queryByText } = render(
            <FunctionField
                record={{ id: 123, foo: 'bar' }}
                render={r => r && r.foo}
                className="foo"
            />
        );
        expect(queryByText('bar').classList).toContain('foo');
    });
});
