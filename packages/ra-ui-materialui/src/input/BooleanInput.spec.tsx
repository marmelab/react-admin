import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResourceContextProvider, testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    const defaultProps = {
        source: 'isPublished',
    };

    it('should render as a checkbox', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{ isPublished: true }}
                        onSubmit={jest.fn}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.type).toBe('checkbox');
    });

    it('should be checked if the value is true', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn}
                        defaultValues={{ isPublished: true }}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should not be checked if the value is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn}
                        defaultValues={{ isPublished: false }}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should not be checked if the value is undefined', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn}>
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(false);
    });

    it('should be checked if the value is undefined and defaultValue is true', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn}>
                        <BooleanInput {...defaultProps} defaultValue={true} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should be checked if the value is true and defaultValue is false', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn}
                        record={{ isPublished: true }}
                    >
                        <BooleanInput {...defaultProps} defaultValue={false} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        expect(input.checked).toBe(true);
    });

    it('should update on click', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        defaultValues={{ isPublished: false }}
                        onSubmit={jest.fn}
                    >
                        <BooleanInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        await waitFor(() => {
            expect(input.checked).toBe(true);
        });
    });

    it('should display errors', async () => {
        // This validator always returns an error
        const validate = () => 'ra.validation.error';

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn}
                        defaultValues={{ isPublished: true }}
                        mode="onChange"
                    >
                        <BooleanInput {...defaultProps} validate={validate} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.isPublished'
        ) as HTMLInputElement;

        fireEvent.click(input);
        await waitFor(() => {
            expect(input.checked).toBe(false);
        });

        await waitFor(() => {
            expect(screen.queryByText('ra.validation.error')).not.toBeNull();
        });
    });
});
