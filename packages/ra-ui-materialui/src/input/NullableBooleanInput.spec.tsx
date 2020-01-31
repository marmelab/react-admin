import React from 'react';
import expect from 'expect';
import { fireEvent, render, cleanup } from '@testing-library/react';
import { Form } from 'react-final-form';

import NullableBooleanInput from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    afterEach(cleanup);

    const defaultProps = {
        source: 'isPublished',
        resource: 'posts',
        value: '',
    };

    it('should give three different choices for true, false or unknown', () => {
        let formApi;
        const { getByText, getByRole, getAllByRole } = render(
            <Form
                onSubmit={jest.fn}
                render={({ form }) => {
                    formApi = form;
                    return <NullableBooleanInput {...defaultProps} />;
                }}
            />
        );
        const select = getByRole('button');
        fireEvent.click(select);
        const options = getAllByRole('option');
        expect(options.length).toEqual(3);

        fireEvent.click(getByText('ra.boolean.null'));
        expect(formApi.getState().values.isPublished).toBeNull();

        fireEvent.click(select);
        fireEvent.click(getByText('ra.boolean.false'));
        expect(formApi.getState().values.isPublished).toEqual(false);

        fireEvent.click(select);
        fireEvent.click(getByText('ra.boolean.true'));
        expect(formApi.getState().values.isPublished).toEqual(true);
    });

    it('should select the option "true" if value is true', () => {
        const { getByRole, getByText, getAllByText, getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    isPublished: true,
                }}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                    />
                )}
            />
        );
        expect(
            getByLabelText('resources.posts.fields.isPublished').getAttribute(
                'value'
            )
        ).toBe('true');
        const select = getByRole('button');
        fireEvent.click(select);
        expect(
            getAllByText('ra.boolean.true')[1].getAttribute('aria-selected')
        ).toBe('true');
        expect(
            getByText('ra.boolean.false').getAttribute('aria-selected')
        ).toBeNull();
        expect(
            getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBeNull();
    });

    it('should select the option "false" if value is false', () => {
        const { getByRole, getByText, getAllByText, getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    isPublished: false,
                }}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                    />
                )}
            />
        );
        expect(
            getByLabelText('resources.posts.fields.isPublished').getAttribute(
                'value'
            )
        ).toBe('false');
        const select = getByRole('button');
        fireEvent.click(select);
        expect(
            getByText('ra.boolean.true').getAttribute('aria-selected')
        ).toBeNull();
        expect(
            getAllByText('ra.boolean.false')[1].getAttribute('aria-selected')
        ).toBe('true');
        expect(
            getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBeNull();
    });

    it('should select the option "null" if value is null', () => {
        const { getByRole, getByText, getAllByText, getByLabelText } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    isPublished: null,
                }}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                    />
                )}
            />
        );
        expect(
            getByLabelText('resources.posts.fields.isPublished').getAttribute(
                'value'
            )
        ).toBe('');
        const select = getByRole('button');
        fireEvent.click(select);
        expect(
            getByText('ra.boolean.true').getAttribute('aria-selected')
        ).toBeNull();
        expect(
            getByText('ra.boolean.false').getAttribute('aria-selected')
        ).toBeNull();
        expect(getByText('ra.boolean.null').getAttribute('aria-selected')).toBe(
            'true'
        );
    });
});
