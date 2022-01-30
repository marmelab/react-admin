import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required } from 'ra-core';

import NumberInput from './NumberInput';

describe('<NumberInput />', () => {
    const defaultProps = {
        source: 'views',
        resource: 'posts',
    };

    it('should use a mui TextField', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{ views: 12 }}
                render={() => <NumberInput {...defaultProps} />}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.views'
        ) as HTMLInputElement;
        expect(input.value).toEqual('12');
        expect(input.getAttribute('type')).toEqual('number');
    });

    describe('props', () => {
        it('should accept `step` prop and pass it to native input', () => {
            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => <NumberInput {...defaultProps} step="0.1" />}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.views'
            ) as HTMLInputElement;
            expect(input.step).toEqual('0.1');
        });
    });

    describe('onChange event', () => {
        it('should be customizable via the `onChange` prop', () => {
            let value;
            const onChange = jest.fn(event => {
                value = event.target.value;
            });

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <NumberInput {...defaultProps} onChange={onChange} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: 3 } });
            expect(value).toEqual('3');
        });

        it('should keep calling redux-form original event', () => {
            let value;
            const onChange = jest.fn(event => {
                value = event.target.value;
            });
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
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
            const input = getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: 3 } });
            expect(value).toEqual('3');
            expect(formApi.getState().values.views).toEqual(3);
        });

        it('should cast value as a numeric one', () => {
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={({ form }) => {
                        formApi = form;
                        return <NumberInput {...defaultProps} />;
                    }}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            fireEvent.change(input, { target: { value: '3' } });
            expect(formApi.getState().values.views).toEqual(3);
            expect(typeof formApi.getState().values.views).toEqual('number');
        });
    });

    describe('onFocus event', () => {
        it('should be customizable via the `onFocus` prop', () => {
            const onFocus = jest.fn();

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <NumberInput {...defaultProps} onFocus={onFocus} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            input.focus();
            expect(onFocus).toHaveBeenCalled();
        });

        it('should keep calling redux-form original event', () => {
            const onFocus = jest.fn();
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <NumberInput {...defaultProps} onFocus={onFocus} />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            input.focus();
            expect(formApi.getState().active).toEqual('views');
        });
    });

    describe('onBlur event', () => {
        it('should be customizable via the `onBlur` prop', () => {
            const onBlur = jest.fn();

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <NumberInput {...defaultProps} onBlur={onBlur} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            input.focus();
            input.blur();
            expect(onBlur).toHaveBeenCalled();
        });

        it('should keep calling redux-form original event', () => {
            const onBlur = jest.fn();
            let formApi;

            const { getByLabelText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={({ form }) => {
                        formApi = form;
                        return (
                            <NumberInput {...defaultProps} onBlur={onBlur} />
                        );
                    }}
                />
            );
            const input = getByLabelText('resources.posts.fields.views');
            input.focus();
            expect(formApi.getState().active).toEqual('views');
            input.blur();
            expect(onBlur).toHaveBeenCalled();
            expect(formApi.getState().active).toBeUndefined();
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views *');
            fireEvent.change(input, { target: { value: '3' } });
            input.blur();

            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, getByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <NumberInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.views *');
            input.focus();
            input.blur();

            const error = getByText('ra.validation.required');
            expect(error).not.toBeNull();
        });
    });
});
