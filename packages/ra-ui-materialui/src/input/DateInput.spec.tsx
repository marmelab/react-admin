import * as React from 'react';
import expect from 'expect';
import { render, fireEvent } from '@testing-library/react';
import { Form } from 'react-final-form';
import { required, FormWithRedirect } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import format from 'date-fns/format';

import DateInput from './DateInput';
import { FormApi } from 'final-form';

describe('<DateInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    it('should render a date input', () => {
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => <DateInput {...defaultProps} />}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('date');
    });

    it('should accept a date string as value', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ publishedAt: '2021-09-11' }}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        expect(formApi.getState().values.publishedAt).toEqual('2021-10-22');
    });

    it('should accept a date time string as value', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ publishedAt: '2021-09-11T06:51:17.772Z' }}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual(
            '2021-09-11T06:51:17.772Z'
        );
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        expect(formApi.getState().values.publishedAt).toEqual('2021-10-22');
    });

    it('should accept a date object as value', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ publishedAt: new Date('2021-09-11') }}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-09-11')
        );
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        expect(formApi.getState().values.publishedAt).toEqual('2021-10-22');
    });

    it('should accept a parse function', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ publishedAt: new Date('2021-09-11') }}
                render={({ form }) => {
                    formApi = form;
                    return (
                        <DateInput
                            {...defaultProps}
                            parse={val => new Date(val)}
                        />
                    );
                }}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-09-11')
        );
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-10-22')
        );
    });

    it('should accept a parse function returning null', () => {
        let formApi;
        const { getByLabelText } = render(
            <Form
                onSubmit={jest.fn()}
                initialValues={{ publishedAt: new Date('2021-09-11') }}
                render={({ form }) => {
                    formApi = form;
                    return <DateInput {...defaultProps} parse={val => null} />;
                }}
            />
        );
        const input = getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        expect(formApi.getState().values.publishedAt).toEqual(
            new Date('2021-09-11')
        );
        fireEvent.change(input, {
            target: { value: '' },
        });
        // Uncommenting this line makes the test fail, cf https://github.com/marmelab/react-admin/issues/6573
        // fireEvent.blur(input);
        expect(formApi.getState().values.publishedAt).toBeNull();
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
                    return <DateInput {...defaultProps} />;
                }}
            />
        );
        expect(getByDisplayValue(format(publishedAt, 'YYYY-MM-DD')));
        expect(formApi.getState().dirty).toEqual(false);
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
            input.focus();
            input.blur();
            expect(queryByText('ra.validation.required')).not.toBeNull();
        });
    });
});
