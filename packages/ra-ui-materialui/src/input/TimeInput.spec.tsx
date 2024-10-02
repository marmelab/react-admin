import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResourceContextProvider, required, testDataProvider } from 'ra-core';
import { format } from 'date-fns';
import { useFormState } from 'react-hook-form';

import { AdminContext } from '../AdminContext';
import { SimpleForm, Toolbar } from '../form';
import { TimeInput } from './TimeInput';
import { ArrayInput, SimpleFormIterator } from './ArrayInput';
import { SaveButton } from '../button';

describe('<TimeInput />', () => {
    const defaultProps = {
        source: 'publishedAt',
    };

    it('should render a time input', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm onSubmit={jest.fn()}>
                        <TimeInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        ) as HTMLInputElement;
        expect(input.type).toBe('time');
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
                        <TimeInput {...defaultProps} />
                        <FormState />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.getByDisplayValue(format(publishedAt, 'HH:mm')));
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
                                <TimeInput source="date" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(screen.getByDisplayValue(format(date, 'HH:mm')));
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
                        <TimeInput {...defaultProps} />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(format(publishedAt, 'HH:mm'))
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
                        <TimeInput
                            {...defaultProps}
                            defaultValue={publishedAt}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(format(publishedAt, 'HH:mm'))
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

    it('should submit null when empty', async () => {
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
                        <TimeInput
                            {...defaultProps}
                            defaultValue={publishedAt}
                        />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            screen.queryByDisplayValue(format(publishedAt, 'HH:mm'))
        ).not.toBeNull();
        const input = screen.getByLabelText(
            'resources.posts.fields.publishedAt'
        );
        fireEvent.change(input, {
            target: { value: '' },
        });
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
                            <TimeInput
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
                            <TimeInput
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
                            <TimeInput
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
