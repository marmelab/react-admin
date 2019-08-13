import React from 'react';
import expect from 'expect';
import { render, fireEvent, cleanup } from '@testing-library/react';

import DateInput from './DateInput';
import { Form } from 'react-final-form';
import { required } from 'ra-core';

describe('<DateInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    afterEach(cleanup);

    it('should render a date input', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <DateInput {...defaultProps} />}
            />
        );
        expect(getByLabelText('resources.posts.fields.publishedAt').type).toBe(
            'date'
        );
    });

    it('should call `input.onChange` method when changed', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        const input = getByLabelText('resources.posts.fields.publishedAt');
        fireEvent.change(input, {
            target: { value: '2010-01-04' },
        });
        expect(formApi.getState().values.publishedAt).toEqual('2010-01-04');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <DateInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            expect(queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    validateOnBlur
                    render={() => (
                        <DateInput {...defaultProps} validate={required()} />
                    )}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.publishedAt *'
            );
            fireEvent.blur(input);
            expect(queryByText('ra.validation.required')).not.toBeNull();
        });
    });
});
