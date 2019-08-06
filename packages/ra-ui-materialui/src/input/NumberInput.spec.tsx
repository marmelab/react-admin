import React from 'react';
import assert from 'assert';
import { render, cleanup, fireEvent } from '@testing-library/react';

import NumberInput from './NumberInput';
import { Form } from 'react-final-form';
import { required } from 'ra-core/lib';

describe('<NumberInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        source: 'stock',
        resource: 'products',
    };

    it('should use a mui TextField', () => {
        const { getByLabelText } = render(
            <Form
                initialValues={{ stock: 12 }}
                onSubmit={jest.fn()}
                render={() => <NumberInput {...defaultProps} />}
            />
        );
        const TextFieldElement = getByLabelText(
            'resources.products.fields.stock'
        );
        expect(TextFieldElement.getAttribute('value')).toEqual('12');
        expect(TextFieldElement.getAttribute('type')).toEqual('number');
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', () => {
            let value;
            const onChange = jest.fn(event => {
                value = event.target.value;
            });

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} onChange={onChange} />
                    )}
                />
            );
            const input = getByLabelText('resources.products.fields.stock');
            fireEvent.change(input, { target: { value: '3' } });
            expect(value).toEqual('3');
        });

        it('should keep calling redux-form original event', () => {
            const onChange = jest.fn();
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <NumberInput
                                {...defaultProps}
                                onChange={onChange}
                            />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.products.fields.stock');
            fireEvent.change(input, { target: { value: '3' } });
            expect(formApi.getState().values.stock).toEqual(3);
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = jest.fn();

            const { getByLabelText } = render(
                <Form
                    initialValues={{ stock: 12 }}
                    onSubmit={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} onFocus={onFocus} />
                    )}
                />
            );
            const input = getByLabelText('resources.products.fields.stock');
            fireEvent.focus(input);
            expect(onFocus).toHaveBeenCalled();
        });

        it('should keep calling redux-form original event', () => {
            const onFocus = jest.fn();
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <NumberInput {...defaultProps} onFocus={onFocus} />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.products.fields.stock');
            fireEvent.focus(input);
            expect(formApi.getState().active).toEqual('stock');
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = jest.fn();

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} onBlur={onBlur} />
                    )}
                />
            );
            const input = getByLabelText('resources.products.fields.stock');
            fireEvent.blur(input);
            expect(onBlur).toHaveBeenCalled();
        });

        it('should keep calling redux-form original event', () => {
            const onBlur = jest.fn();
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <NumberInput {...defaultProps} onBlur={onBlur} />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.products.fields.stock');
            fireEvent.focus(input);
            expect(formApi.getState().active).toEqual('stock');
            fireEvent.blur(input);
            expect(formApi.getState().active).toEqual(undefined);
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <NumberInput
                                {...defaultProps}
                                validate={required()}
                            />
                            <button type="submit" aria-label="Save" />
                        </form>
                    )}
                />
            );
            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { queryByText, getByLabelText } = render(
                <Form
                    onSubmit={jest.fn()}
                    validateOnBlur
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <NumberInput
                                {...defaultProps}
                                validate={required()}
                            />
                            <button type="submit" aria-label="Save" />
                        </form>
                    )}
                />
            );
            const TextFieldElement = getByLabelText(
                'resources.products.fields.stock *'
            );

            fireEvent.change(TextFieldElement, { target: { value: '12' } });
            fireEvent.blur(TextFieldElement);
            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { queryByText, getByLabelText } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn()}
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText('resources.products.fields.stock *');

            fireEvent.change(input, {
                target: { value: '12' },
            });
            fireEvent.change(input, {
                target: { value: '' },
            });
            fireEvent.blur(input);
            expect(queryByText('ra.validation.required')).not.toBeNull();
        });
    });
});
