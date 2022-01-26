import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { testDataProvider } from 'ra-core';

import { SimpleForm } from '../form';
import { AdminContext } from '../AdminContext';

import { NullableBooleanInput } from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        source: 'isPublished',
        resource: 'posts',
        value: '',
    };

    it('should give three different choices for true, false or unknown', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: true }}
                    onSubmit={jest.fn()}
                >
                    <NullableBooleanInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        const options = screen.getAllByRole('option');
        expect(options.length).toEqual(3);

        fireEvent.click(screen.getByText('ra.boolean.null'));
        expect(screen.getByDisplayValue('')).not.toBeNull();

        fireEvent.mouseDown(select);
        fireEvent.click(screen.getByText('ra.boolean.false'));
        fireEvent.click(screen.getByText('ra.action.save'));
        expect(screen.getByDisplayValue('false')).not.toBeNull();

        fireEvent.mouseDown(select);
        fireEvent.click(screen.getByText('ra.boolean.true'));
        expect(screen.getByDisplayValue('true')).not.toBeNull();
    });

    it('should select the option "true" if value is true', () => {
        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: true }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'true'
        );
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(
            screen
                .getAllByText('ra.boolean.true')[1]
                .getAttribute('aria-selected')
        ).toBe('true');
        expect(
            screen.getByText('ra.boolean.false').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen.getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBe('false');
    });

    it('should select the option "true" if defaultValue is true', () => {
        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        defaultValue
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'true'
        );
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(
            screen
                .getAllByText('ra.boolean.true')[1]
                .getAttribute('aria-selected')
        ).toBe('true');
        expect(
            screen.getByText('ra.boolean.false').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen.getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBe('false');
    });

    it('should select the option "false" if value is false', () => {
        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: false }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'false'
        );
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(
            screen.getByText('ra.boolean.true').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen
                .getAllByText('ra.boolean.false')[1]
                .getAttribute('aria-selected')
        ).toBe('true');
        expect(
            screen.getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBe('false');
    });

    it('should select the option "false" if defaultValue is false', () => {
        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        defaultValue={false}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(container.querySelector('input').getAttribute('value')).toBe(
            'false'
        );
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(
            screen.getByText('ra.boolean.true').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen
                .getAllByText('ra.boolean.false')[1]
                .getAttribute('aria-selected')
        ).toBe('true');
        expect(
            screen.getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBe('false');
    });

    it('should select the option "null" if value is null', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: null }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('')).not.toBeNull();
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(
            screen.getByText('ra.boolean.true').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen.getByText('ra.boolean.false').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen.getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBe('true');
    });

    it('should select the option "null" if defaultValue is null', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ title: 'hello' }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        defaultValue={null}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('')).not.toBeNull();
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(
            screen.getByText('ra.boolean.true').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen.getByText('ra.boolean.false').getAttribute('aria-selected')
        ).toBe('false');
        expect(
            screen.getByText('ra.boolean.null').getAttribute('aria-selected')
        ).toBe('true');
    });

    it('should allow to customize the label of the null option', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: null }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        nullLabel="example null label"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('')).not.toBeNull();
        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(screen.getByText('example null label')).not.toBeNull();
    });

    it('should allow to customize the label of the false option', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: null }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        falseLabel="example false label"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('')).not.toBeNull();

        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(screen.getByText('example false label')).not.toBeNull();
    });

    it('should allow to customize the label of the true option', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    defaultValues={{ isPublished: null }}
                    onSubmit={jest.fn}
                >
                    <NullableBooleanInput
                        source="isPublished"
                        resource="posts"
                        trueLabel="example true label"
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByDisplayValue('')).not.toBeNull();

        const select = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        );
        fireEvent.mouseDown(select);
        expect(screen.getByText('example true label')).not.toBeNull();
    });
});
