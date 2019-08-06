import React from 'react';
import assert from 'assert';
import { render, cleanup } from '@testing-library/react';

import { LongTextInput } from './LongTextInput';

describe('<LongTextInput />', () => {
    afterEach(cleanup);
    const defaultProps = {
        // We have to specify the id ourselves here because the
        // TextInput is not wrapped inside a FormInput.
        // This is needed to link the label to the input
        id: 'foo',
        source: 'foo',
        resource: 'bar',
        meta: {},
        input: {
            value: '',
        },
        onChange: jest.fn(),
    };

    it('should render the input as a textarea', () => {
        const { getByLabelText } = render(
            <LongTextInput {...defaultProps} input={{ value: 'hello' }} />
        );
        const TextFieldElement = getByLabelText('resources.bar.fields.foo');
        assert.equal(TextFieldElement.tagName, 'TEXTAREA');
        assert.equal(TextFieldElement.value, 'hello');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <LongTextInput
                    {...defaultProps}
                    meta={{ touched: false, error: 'Required field.' }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { queryByText } = render(
                <LongTextInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByText } = render(
                <LongTextInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const error = getByText('Required field.');
            assert.ok(error);
        });
    });
});
