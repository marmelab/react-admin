import * as React from 'react';
import { render } from '@testing-library/react';
import FunctionField from './FunctionField';
import { RecordContextProvider } from 'ra-core';

describe('<FunctionField />', () => {
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

    it('should use record from RecordContext', () => {
        const record = { id: 123, foo: 'bar' };
        const { queryByText } = render(
            <RecordContextProvider value={record}>
                <FunctionField render={r => r && r.foo.substr(0, 2)} />
            </RecordContextProvider>
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
