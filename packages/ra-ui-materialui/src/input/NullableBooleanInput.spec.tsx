import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Form } from 'react-final-form';

import NullableBooleanInput from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        source: 'isPublished',
        resource: 'posts',
        value: '',
    };

    it('should give three different choices for true, false or unknown', async () => {
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
        fireEvent.mouseDown(select);
        const options = getAllByRole('option');
        expect(options.length).toEqual(3);

        fireEvent.click(getByText('ra.boolean.null'));
        await waitFor(() => {
            expect(formApi.getState().values.isPublished).toBeUndefined();
        });

        fireEvent.mouseDown(select);
        fireEvent.click(getByText('ra.boolean.false'));
        await waitFor(() => {
            expect(formApi.getState().values.isPublished).toEqual(false);
        });

        fireEvent.mouseDown(select);
        fireEvent.click(getByText('ra.boolean.true'));
        await waitFor(() => {
            expect(formApi.getState().values.isPublished).toEqual(true);
        });
    });

    it('should select the option "true" if value is true', () => {
        const { container, getByRole, getByText, getAllByText } = render(
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
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'true'
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
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

    it('should select the option "true" if defaultValue is true', () => {
        const { container, getByRole, getByText, getAllByText } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        defaultValue
                    />
                )}
            />
        );
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'true'
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
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
        const { getByRole, getByText, getAllByText, container } = render(
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
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'false'
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
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

    it('should select the option "false" if defaultValue is false', () => {
        const { getByRole, getByText, getAllByText, container } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        defaultValue={false}
                    />
                )}
            />
        );
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'false'
        );
        const select = getByRole('button');
        fireEvent.mouseDown(select);
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
        const { getByRole, getByText, container } = render(
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
        expect(container.querySelector('input').getAttribute('value')).toBe('');
        const select = getByRole('button');
        fireEvent.mouseDown(select);
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

    it('should select the option "null" if defaultValue is null', () => {
        const { getByRole, getByText, container } = render(
            <Form
                onSubmit={jest.fn}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        defaultValue={null}
                    />
                )}
            />
        );
        expect(container.querySelector('input').getAttribute('value')).toBe('');
        const select = getByRole('button');
        fireEvent.mouseDown(select);
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

    it('should allow to customize the label of the null option', () => {
        const { getByRole, getByText, container } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    isPublished: null,
                }}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        nullLabel="example null label"
                    />
                )}
            />
        );
        expect(container.querySelector('input').getAttribute('value')).toBe('');
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        expect(getByText('example null label')).not.toBeNull();
    });

    it('should allow to customize the label of the false option', () => {
        const { getByRole, getByText, container } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    isPublished: null,
                }}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        falseLabel="example false label"
                    />
                )}
            />
        );
        expect(container.querySelector('input').getAttribute('value')).toBe('');
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        expect(getByText('example false label')).not.toBeNull();
    });

    it('should allow to customize the label of the true option', () => {
        const { getByRole, getByText, container } = render(
            <Form
                onSubmit={jest.fn}
                initialValues={{
                    isPublished: null,
                }}
                render={() => (
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        trueLabel="example true label"
                    />
                )}
            />
        );
        expect(container.querySelector('input').getAttribute('value')).toBe('');
        const select = getByRole('button');
        fireEvent.mouseDown(select);
        expect(getByText('example true label')).not.toBeNull();
    });
});
