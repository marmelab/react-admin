import React from 'react';
import { render, cleanup } from 'react-testing-library';

import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        id: 'bar',
        resource: 'foo',
        source: 'bar',
        input: {},
        meta: {},
    };

    it('should render as a checkbox', () => {
        const { getByLabelText } = render(<BooleanInput {...defaultProps} />);
        expect(getByLabelText('resources.foo.fields.bar').type).toBe(
            'checkbox'
        );
    });

    it('should be checked if the value is true', () => {
        const { getByLabelText } = render(
            <BooleanInput {...defaultProps} input={{ value: true }} />
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        const { getByLabelText } = render(
            <BooleanInput {...defaultProps} input={{ value: false }} />
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        const { getByLabelText } = render(
            <BooleanInput {...defaultProps} input={{}} />
        );
        expect(getByLabelText('resources.foo.fields.bar').checked).toBe(false);
    });

    it('should displays errors', () => {
        const { queryAllByText } = render(
            <BooleanInput
                {...defaultProps}
                source="foo"
                input={{}}
                meta={{ touched: true, error: 'foobar' }}
            />
        );
        expect(queryAllByText('foobar')).toHaveLength(1);
    });
});
