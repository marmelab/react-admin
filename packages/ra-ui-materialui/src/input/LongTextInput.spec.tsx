import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required } from 'ra-core';

import LongTextInput from './LongTextInput';

describe('<LongTextInput />', () => {
    afterEach(cleanup);
    const defaultProps = {
        source: 'body',
        resource: 'posts',
    };

    it('should render the input as a textarea', () => {
        const { getByLabelText } = render(
            <Form
                initialValues={{ body: 'hello' }}
                onSubmit={jest.fn}
                render={() => <LongTextInput {...defaultProps} />}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.body'
        ) as HTMLInputElement;
        expect(input.tagName).toEqual('TEXTAREA');
        expect(input.value).toEqual('hello');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <LongTextInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should not be displayed if field has been touched but is valid', () => {
            // Validator which always return undefined so the field is valid
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <LongTextInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.body *');
            fireEvent.change(input, { target: { value: 'test' } });
            fireEvent.blur(input);
            const error = queryByText('ra.validation.required');
            expect(error).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    validateOnBlur
                    onSubmit={jest.fn}
                    render={() => (
                        <LongTextInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            const input = getByLabelText('resources.posts.fields.body *');
            fireEvent.blur(input);
            const error = queryByText('ra.validation.required');
            expect(error).not.toBeNull();
        });
    });
});
