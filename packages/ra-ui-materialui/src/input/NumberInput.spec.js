import React from 'react';
import assert from 'assert';
import { render, cleanup, fireEvent } from '@testing-library/react';

import { NumberInput } from './NumberInput';

describe('<NumberInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        // We have to specify the id ourselves here because the
        // TextInput is not wrapped inside a FormInput
        id: 'foo',
        source: 'foo',
        resource: 'bar',
        meta: {},
        input: {
            onBlur: () => {},
            onChange: () => {},
            onFocus: () => {},
        },
        onChange: () => {},
        onBlur: () => {},
        onFocus: () => {},
    };

    it('should use a mui TextField', () => {
        const { getByLabelText } = render(
            <NumberInput {...defaultProps} input={{ value: 12 }} />
        );
        const TextFieldElement = getByLabelText('resources.bar.fields.foo');
        assert.equal(TextFieldElement.value, '12');
        assert.equal(TextFieldElement.getAttribute('type'), 'number');
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', () => {
            const onChange = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} onChange={onChange} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.change(TextFieldElement, { target: { value: 3 } });
            assert.equal(onChange.mock.calls[0][0], 3);
        });

        it('should keep calling redux-form original event', () => {
            const onChange = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} input={{ value: 2, onChange }} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.change(TextFieldElement, { target: { value: 3 } });
            assert.equal(onChange.mock.calls[0][0], 3);
        });

        it('should cast value as a numeric one', () => {
            const onChange = jest.fn();

            const { getByLabelText } = render(
                <NumberInput
                    {...defaultProps}
                    input={{ value: '1', onChange }}
                />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.change(TextFieldElement, { target: { value: '2' } });
            assert.equal(onChange.mock.calls[0][0], '2');
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} onFocus={onFocus} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.focus(TextFieldElement);
            assert.equal(onFocus.mock.calls.length, 1);
        });

        it('should keep calling redux-form original event', () => {
            const onFocus = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} input={{ value: 2, onFocus }} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.focus(TextFieldElement);
            assert.equal(onFocus.mock.calls.length, 1);
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} onBlur={onBlur} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.blur(TextFieldElement, { target: { value: 3 } });
            assert.equal(onBlur.mock.calls[0][0], 3);
        });

        it('should keep calling redux-form original event', () => {
            const onBlur = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} input={{ value: 2, onBlur }} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.blur(TextFieldElement, { target: { value: 3 } });
            assert.equal(onBlur.mock.calls[0][0], 3);
        });

        it('should cast value as a numeric one', () => {
            const onBlur = jest.fn();

            const { getByLabelText } = render(
                <NumberInput {...defaultProps} input={{ value: '1', onBlur }} />
            );
            const TextFieldElement = getByLabelText('resources.bar.fields.foo');
            fireEvent.blur(TextFieldElement, { target: { value: '2' } });
            assert.equal(onBlur.mock.calls[0][0], '2');
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <NumberInput
                    {...defaultProps}
                    meta={{ touched: false, error: 'Required field.' }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { queryByText } = render(
                <NumberInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const error = queryByText('Required field.');
            assert.ok(!error);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByText } = render(
                <NumberInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const error = getByText('Required field.');
            assert.ok(error);
        });
    });
});
