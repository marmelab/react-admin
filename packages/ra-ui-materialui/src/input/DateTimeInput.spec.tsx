import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { required, testDataProvider } from 'ra-core';
import { format } from 'date-fns';
import { useFormState } from 'react-hook-form';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { DateTimeInput } from './DateTimeInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';

describe('<DateTimeInput />', () => {
    const defaultProps = {
        resource: 'posts',
        source: 'publishedAt',
    };

    it('should render a date time input', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <DateTimeInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('datetime-local');
    });

    it('should not make the form dirty on initialization', () => {
        const publishedAt = new Date();
        const FormState = () => {
            const { isDirty } = useFormState();

            return <p>Dirty: {isDirty.toString()}</p>;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn()}
                    record={{ id: 1, publishedAt: publishedAt.toISOString() }}
                >
                    <DateTimeInput {...defaultProps} />
                    <FormState />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.getByDisplayValue(format(publishedAt, "yyyy-MM-dd'T'HH:mm"))
        );
        expect(screen.queryByText('Dirty: false')).not.toBeNull();
    });

    it('should display a default value inside an ArrayInput', () => {
        const date = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const backlinksDefaultValue = [
            {
                date,
            },
        ];
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn()}>
                    <ArrayInput
                        defaultValue={backlinksDefaultValue}
                        source="backlinks"
                    >
                        <SimpleFormIterator>
                            <DateTimeInput source="date" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        expect(screen.getByDisplayValue(format(date, "yyyy-MM-dd'T'HH:mm")));
    });

    it('should submit the form default value with its timezone', async () => {
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={onSubmit} defaultValues={{ publishedAt }}>
                    <DateTimeInput {...defaultProps} />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(
                format(publishedAt, "yyyy-MM-dd'T'HH:mm")
            )
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                publishedAt,
            });
        });
    });

    it('should submit the input default value with its timezone', async () => {
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={onSubmit}>
                    <DateTimeInput
                        {...defaultProps}
                        defaultValue={publishedAt}
                    />
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(
                format(publishedAt, "yyyy-MM-dd'T'HH:mm")
            )
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                publishedAt,
            });
        });
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()}>
                        <DateTimeInput
                            {...defaultProps}
                            validate={required()}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            expect(screen.queryByText('ra.validation.required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <SimpleForm onSubmit={jest.fn()} mode="onBlur">
                        <DateTimeInput
                            {...defaultProps}
                            validate={required()}
                        />
                    </SimpleForm>
                </AdminContext>
            );
            const input = screen.getByLabelText(
                'resources.posts.fields.publishedAt *'
            );
            fireEvent.blur(input);
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.required')
                ).not.toBeNull();
            });
        });
    });
});
