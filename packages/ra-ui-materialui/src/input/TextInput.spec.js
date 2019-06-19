import assert from 'assert';
import React from 'react';
import { render, cleanup, fireEvent } from 'react-testing-library';

import { TextInput } from './TextInput';

describe('<TextInput />', () => {
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
    };

    afterEach(cleanup);

    it('should render the input correctly', () => {
        const { getByLabelText } = render(
            <TextInput {...defaultProps} input={{ value: 'hello' }} />
        );
        const TextFieldElement = getByLabelText('resources.bar.fields.foo');
        assert.equal(TextFieldElement.value, 'hello');
        assert.equal(TextFieldElement.getAttribute('type'), 'text');
    });

    it('should use a ResettableTextField when type is password', () => {
        const { getByLabelText } = render(
            <TextInput {...defaultProps} type="password" />
        );
        const TextFieldElement = getByLabelText('resources.bar.fields.foo');
        assert.equal(TextFieldElement.getAttribute('type'), 'password');
    });

    it('should call redux-form onBlur handler when blurred', () => {
        const onBlur = jest.fn();
        const { getByLabelText } = render(
            <TextInput {...defaultProps} input={{ onBlur, value: '' }} />
        );

        const TextFieldElement = getByLabelText('resources.bar.fields.foo');
        fireEvent.blur(TextFieldElement);
        assert.equal(onBlur.mock.calls.length, 1);
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <TextInput
                    {...defaultProps}
                    meta={{ touched: false, error: 'Required field.' }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { queryByText } = render(
                <TextInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByText } = render(
                <TextInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const error = getByText('Required field.');
            assert.ok(error);
        });
    });
});
