import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResourceContextProvider, required, testDataProvider } from 'ra-core';
import { format } from 'date-fns';
import { useFormState } from 'react-hook-form';

import { AdminContext } from '../AdminContext';
import { SimpleForm, Toolbar } from '../form';
import { DateTimeInput } from './DateTimeInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import { SaveButton } from '../button';
import {
    ExternalChanges,
    ExternalChangesWithParse,
} from './DateTimeInput.stories';

describe('<DateTimeInput />', () => {
    const defaultProps = {
        source: 'publishedAt',
    };

    it('should render a date time input', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <DateTimeInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={jest.fn()}
                        record={{
                            id: 1,
                            publishedAt: publishedAt.toISOString(),
                        }}
                    >
                        <DateTimeInput {...defaultProps} />
                        <FormState />
                    </SimpleForm>
                </ResourceContextProvider>
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
                <ResourceContextProvider value="posts">
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
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.getByDisplayValue(format(date, "yyyy-MM-dd'T'HH:mm")));
    });

    it('should submit the form default value with its timezone', async () => {
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt }}
                        toolbar={
                            <Toolbar>
                                <SaveButton alwaysEnable />
                            </Toolbar>
                        }
                    >
                        <DateTimeInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(
                format(publishedAt, "yyyy-MM-dd'T'HH:mm")
            )
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt,
                },
                expect.anything()
            );
        });
    });

    it('should submit the input default value with its timezone', async () => {
        const publishedAt = new Date('Wed Oct 05 2011 16:48:00 GMT+0200');
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        toolbar={
                            <Toolbar>
                                <SaveButton alwaysEnable />
                            </Toolbar>
                        }
                    >
                        <DateTimeInput
                            {...defaultProps}
                            defaultValue={publishedAt}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(
                format(publishedAt, "yyyy-MM-dd'T'HH:mm")
            )
        ).not.toBeNull();
        fireEvent.click(screen.getByLabelText('ra.action.save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt,
                },
                expect.anything()
            );
        });
    });

    it('should return null when datetime is empty', async () => {
        const onSubmit = jest.fn();
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm
                        onSubmit={onSubmit}
                        defaultValues={{ publishedAt: new Date('2021-09-11') }}
                    >
                        <DateTimeInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.value).toBe(
            format(new Date('2021-09-11'), "yyyy-MM-dd'T'HH:mm")
        );
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

    it('should change its value when the form value has changed', async () => {
        render(<ExternalChanges />);
        await screen.findByText('"2021-09-11 20:00:00" (string)');
        const input = screen.getByLabelText('Published') as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '2021-10-30 09:00:00' },
        });
        fireEvent.blur(input);
        await screen.findByText('"2021-10-30T09:00" (string)');
        fireEvent.click(screen.getByText('Change value'));
        await screen.findByText('"2021-10-20 10:00:00" (string)');
    });

    it('should change its value when the form value has changed with custom parse', async () => {
        render(<ExternalChangesWithParse />);
        await screen.findByText(
            // Because of the parse that uses the Date object, we check the value displayed and not the form value
            // to avoid timezone issues
            'Sat Sep 11 2021 20:00:00 GMT+0200 (Central European Summer Time)'
        );
        const input = screen.getByLabelText('Published') as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '2021-10-30 09:00:00' },
        });
        fireEvent.blur(input);
        await screen.findByText(
            'Sat Oct 30 2021 09:00:00 GMT+0200 (Central European Summer Time)'
        );
        fireEvent.click(screen.getByText('Change value'));
        await screen.findByText(
            'Wed Oct 20 2021 10:00:00 GMT+0200 (Central European Summer Time)'
        );
    });

    it('should change its value when the form value is reset', async () => {
        render(<ExternalChanges />);
        await screen.findByText('"2021-09-11 20:00:00" (string)');
        const input = screen.getByLabelText('Published') as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '2021-10-30 09:00:00' },
        });
        fireEvent.blur(input);
        await screen.findByText('"2021-10-30T09:00" (string)');
        fireEvent.click(screen.getByText('Reset'));
        await screen.findByText('"2021-09-11 20:00:00" (string)');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm onSubmit={jest.fn()}>
                            <DateTimeInput
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
                            <DateTimeInput
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
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.required')
                ).not.toBeNull();
            });
        });

        it('should be displayed if field has been touched multiple times and is invalid', async () => {
            const onSubmit = jest.fn();
            render(
                <AdminContext dataProvider={testDataProvider()}>
                    <ResourceContextProvider value="posts">
                        <SimpleForm mode="onBlur" onSubmit={onSubmit}>
                            <DateTimeInput
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
            fireEvent.change(input, {
                target: { value: new Date().toISOString() },
            });
            fireEvent.blur(input);
            await waitFor(() => {
                expect(screen.queryByText('ra.validation.required')).toBeNull();
            });
            fireEvent.change(input, {
                target: { value: '' },
            });
            fireEvent.blur(input);
            await waitFor(() => {
                expect(
                    screen.queryByText('ra.validation.required')
                ).not.toBeNull();
            });
        });
    });
});
