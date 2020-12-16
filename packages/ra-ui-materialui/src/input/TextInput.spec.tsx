import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';

import TextInput from './TextInput';
import { required } from 'ra-core';

describe('<TextInput />', () => {
    const defaultProps = {
        source: 'title',
        resource: 'posts',
    };

    it('should render the input correctly', () => {
        const { getByLabelText } = render(
            <Form
                initialValues={{ title: 'hello' }}
                onSubmit={jest.fn}
                render={() => <TextInput {...defaultProps} />}
            />
        );
        const TextFieldElement = getByLabelText(
            'resources.posts.fields.title'
        ) as HTMLInputElement;
        expect(TextFieldElement.value).toEqual('hello');
        expect(TextFieldElement.getAttribute('type')).toEqual('text');
    });

    it('should use a ResettableTextField when type is password', () => {
        const { getByLabelText } = render(
            <Form
                initialValues={{ title: 'hello' }}
                onSubmit={jest.fn}
                render={() => <TextInput {...defaultProps} type="password" />}
            />
        );
        const TextFieldElement = getByLabelText('resources.posts.fields.title');
        expect(TextFieldElement.getAttribute('type')).toEqual('password');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <TextInput {...defaultProps} validate={required()} />
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
                    render={() => (
                        <TextInput {...defaultProps} validate={required()} />
                    )}
                />
            );

            const input = getByLabelText('resources.posts.fields.title *');
            fireEvent.change(input, { target: { value: 'test' } });
            input.blur();
            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <TextInput {...defaultProps} validate={required()} />
                    )}
                />
            );

            const input = getByLabelText('resources.posts.fields.title *');
            input.focus();
            input.blur();
            const error = queryByText('ra.validation.required');
            expect(error).not.toBeNull();
        });
    });
});
