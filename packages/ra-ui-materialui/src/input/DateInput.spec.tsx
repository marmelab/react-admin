import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { required, ResourceContextProvider, testDataProvider } from 'ra-core';
import { format } from 'date-fns';
import { useFormState } from 'react-hook-form';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { DateInput } from './DateInput';

describe('<DateInput />', () => {
    const defaultProps = {
        source: 'publishedAt',
    };

    it('should render a date input', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <DateInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('date');
    });

    it('should accept a date string as value', async () => {
        let onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt: '2021-09-11' }}
                    >
                        <DateInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: '2021-10-22',
                },
                expect.anything()
            );
        });
    });

    it('should accept a date time string as value', async () => {
        let onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{
                            publishedAt: '2021-09-11T06:51:17.772Z',
                        }}
                    >
                        <DateInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: '2021-10-22',
                },
                expect.anything()
            );
        });
    });

    it('should accept a date object as value', async () => {
        let onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    >
                        <DateInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: '2021-10-22',
                },
                expect.anything()
            );
        });
    });

    it('should accept a parse function', async () => {
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    >
                        <DateInput
                            {...defaultProps}
                            parse={val => new Date(val)}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: new Date('2021-10-22'),
                },
                expect.anything()
            );
        });
    });

    it('should accept a parse function returning null', async () => {
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    >
                        <DateInput {...defaultProps} parse={() => null} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '' },
        });
        fireEvent.blur(input);
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: null,
                },
                expect.anything()
            );
        });
    });

    it('should not make the form dirty on initialization', () => {
        const publishedAt = new Date();
        const FormState = () => {
            const { isDirty } = useFormState();

            return <p>Dirty: {isDirty.toString()}</p>;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        record={{
                            id: 1,
                            publishedAt: publishedAt.toISOString(),
                        }}
                    >
                        <DateInput {...defaultProps} />
                        <FormState />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.getByDisplayValue(format(publishedAt, 'yyy-MM-dd')));
        expect(screen.queryByText('Dirty: false')).not.toBeNull();
    });

    it('should return null when date is empty', async () => {
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    >
                        <DateInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '' },
        });
        fireEvent.blur(input);
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: null,
                },
                expect.anything()
            );
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <DateInput
                                {...defaultProps}
                                validate={required()}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            expect(screen.queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()} mode="onBlur">
                            <DateInput
                                {...defaultProps}
                                validate={required()}
                            />
                        </SimpleForm>
                    </ResourceContextProvider>
                </AdminContext>
            );
            const input = screen.getByLabelText(
                'resources.posts.fields.publishedAt *'
            );
            fireEvent.blur(input);
            await screen.findByText('ra.validation.required');
        });
    });
});
