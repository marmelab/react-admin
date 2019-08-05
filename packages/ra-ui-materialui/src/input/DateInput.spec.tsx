import React from 'react';
import expect from 'expect';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required } from 'ra-core';

import DateInput from './DateInput';

describe('<DateInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    afterEach(cleanup);

    it('should render a date input', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={() => <DateInput {...defaultProps} />}
            />
        );
        expect(getByLabelText('resources.posts.fields.publishedAt').type).toBe(
            'date'
        );
    });

    it('should propagate value when changed', () => {
        const onSubmit = jest.fn();

        const { getByLabelText } = render(
            <Form
                onSubmit={onSubmit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <DateInput {...defaultProps} />
                        <button type="submit" aria-label="Save" />
                    </form>
                )}
            />
        );
        fireEvent.change(getByLabelText('resources.posts.fields.publishedAt'), {
            target: { value: '2010-01-04' },
        });
        fireEvent.submit(getByLabelText('Save'));
        expect(onSubmit.mock.calls[0][0]).toEqual({
            publishedAt: '2010-01-04',
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    validateOnBlur
                    initialValues={{ publishedAt: '' }}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DateInput
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

        it('should be displayed if field has been touched and is invalid', () => {
            const { getByLabelText, queryByText } = render(
                <Form
                    onSubmit={jest.fn()}
                    validateOnBlur
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <DateInput
                                {...defaultProps}
                                validate={required()}
                            />
                            <button type="submit" aria-label="Save" />
                        </form>
                    )}
                />
            );

            const input = getByLabelText(
                'resources.posts.fields.publishedAt *'
            );
            fireEvent.change(input, {
                target: { value: '2010-01-04' },
            });
            fireEvent.change(input, {
                target: { value: '' },
            });
            fireEvent.blur(input);

            expect(queryByText('ra.validation.required')).not.toBeNull();
        });
    });
});
