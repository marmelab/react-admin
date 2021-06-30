import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required, FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import format from 'date-fns/format';

import DateTimeInput from './DateTimeInput';
import { FormApi } from 'final-form';

describe('<DateTimeInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    it('should render a date time input', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <DateTimeInput {...defaultProps} />}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('datetime-local');
    });

    it('should not make the form dirty on initialization', () => {
        const publishedAt = new Date().toISOString();
        let formApi: FormApi;
        const { getByDisplayValue } = renderWithRedux(
            <FormWithRedirect
                onSubmit={jest.fn}
                record={{ id: 1, publishedAt }}
                render={({ form }) => {
                    formApi = form;
                    return <DateTimeInput {...defaultProps} />;
                }}
            />
        );
        expect(getByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm')));
        expect(formApi.getState().dirty).toEqual(false);
    });

    it('should submit initial value with its timezone', () => {
        const publishedAt = new Date().toISOString();
        const onSubmit = jest.fn();
        const { getByDisplayValue, getByText } = renderWithRedux(
            <Form
                onSubmit={onSubmit}
                initialValues={{ publishedAt }}
                render={({ handleSubmit }) => {
                    return (
                        <form onSubmit={handleSubmit}>
                            <DateTimeInput {...defaultProps} />
                            <button type="submit">save</button>
                        </form>
                    );
                }}
            />
        );
        expect(getByDisplayValue(format(publishedAt, 'YYYY-MM-DDTHH:mm')));
        fireEvent.click(getByText('save'));
        expect(onSubmit.mock.calls[0][0]).toEqual({
            publishedAt,
        });
    });

    it('should call `input.onChange` method when changed', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ form }) => {
                    formApi = form;
                    return <DateTimeInput {...defaultProps} />;
                }}
            />
        );
        const input = getByLabelText('resources.posts.fields.publishedAt');
        fireEvent.change(input, {
            target: { value: '2010-01-04T10:20' },
        });
        expect(formApi.getState().values.publishedAt).toEqual(
            '2010-01-04T09:20:00.000Z'
        );
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const { queryByText } = render(
                <Form
                    onSubmit={jest.fn}
                    render={() => (
                        <DateTimeInput
                            {...defaultProps}
                            validate={required()}
                        />
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
                        <DateTimeInput
                            {...defaultProps}
                            validate={required()}
                        />
                    )}
                />
            );
            const input = getByLabelText(
                'resources.posts.fields.publishedAt *'
            );
            input.focus();
            input.blur();
            expect(queryByText('ra.validation.required')).not.toBeNull();
        });
    });
});
