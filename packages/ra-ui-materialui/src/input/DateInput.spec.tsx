import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { required, ResourceContextProvider, testDataProvider } from 'ra-core';
import { format } from 'date-fns';
import { useFormState } from 'react-hook-form';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from '../form';
import { DateInput } from './DateInput';
import {
    Basic,
    ExternalChanges,
    ExternalChangesWithParse,
    Parse,
} from './DateInput.stories';

describe('<DateInput />', () => {
    const defaultProps = {
        source: 'publishedAt',
    };

    it('should render a date input', () => {
        render(<Basic />);
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.type).toBe('date');
    });

    it('should accept a date string as value', async () => {
        let onSubmit = jest.fn();
        render(
            <Basic
                simpleFormProps={{
                    onSubmit,
                    defaultValues: { publishedAt: '2021-09-11' },
                }}
            />
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('Save'));
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
            <Basic
                simpleFormProps={{
                    onSubmit,
                    defaultValues: { publishedAt: '2021-09-11T06:51:17.772Z' },
                }}
            />
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('Save'));
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
            <Basic
                simpleFormProps={{
                    onSubmit,
                    defaultValues: { publishedAt: new Date('2021-09-11') },
                }}
            />
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('Save'));
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith(
                {
                    publishedAt: '2021-10-22',
                },
                expect.anything()
            );
        });
    });

    describe('TimeZones', () => {
        it.each([
            '2021-09-11T20:46:20.000+02:00',
            '2021-09-11 20:46:20.000+02:00',
            '2021-09-10T20:46:20.000-04:00',
            '2021-09-10 20:46:20.000-04:00',
            '2021-09-11T20:46:20.000Z',
            '2021-09-11 20:46:20.000Z',
        ])('should accept a value with timezone %s', async publishedAt => {
            let onSubmit = jest.fn();
            render(
                <Basic
                    simpleFormProps={{
                        onSubmit,
                        defaultValues: { publishedAt },
                    }}
                />
            );
            const input = screen.getByLabelText(
                'Published at'
            ) as HTMLInputElement;
            expect(input.value).toBe('2021-09-11');
            fireEvent.change(input, {
                target: { value: '2021-10-22' },
            });
            fireEvent.click(screen.getByLabelText('Save'));
            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(
                    {
                        publishedAt: '2021-10-22',
                    },
                    expect.anything()
                );
            });
        });
    });

    it('should accept a parse function', async () => {
        const onSubmit = jest.fn();
        render(
            <Parse
                simpleFormProps={{
                    onSubmit,
                    defaultValues: { publishedAt: new Date('2021-09-11') },
                }}
            />
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '2021-10-22' },
        });
        fireEvent.click(screen.getByLabelText('Save'));
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
            <Basic
                simpleFormProps={{
                    onSubmit,
                    defaultValues: { publishedAt: new Date('2021-09-11') },
                }}
                dateInputProps={{
                    parse: () => null,
                }}
            />
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '' },
        });
        fireEvent.blur(input);
        fireEvent.click(screen.getByLabelText('Save'));
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
            <Basic
                simpleFormProps={{
                    onSubmit,
                    defaultValues: { publishedAt: new Date('2021-09-11') },
                }}
            />
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        expect(input.value).toBe('2021-09-11');
        fireEvent.change(input, {
            target: { value: '' },
        });
        fireEvent.blur(input);
        fireEvent.click(screen.getByLabelText('Save'));
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
        await screen.findByText('"2021-09-11" (string)');
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '2021-10-30' },
        });
        fireEvent.blur(input);
        await screen.findByText('"2021-10-30" (string)');
        fireEvent.click(screen.getByText('Change value'));
        await screen.findByText('"2021-10-20" (string)');
    });

    it('should change its value when the form value has changed with a custom parse', async () => {
        render(<ExternalChangesWithParse />);
        await screen.findByText(
            'Sat Sep 11 2021 02:00:00 GMT+0200 (Central European Summer Time)'
        );
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '2021-10-30' },
        });
        fireEvent.blur(input);
        await screen.findByText(
            'Sat Oct 30 2021 02:00:00 GMT+0200 (Central European Summer Time)'
        );
        fireEvent.click(screen.getByText('Change value'));
        await screen.findByText(
            'Wed Oct 20 2021 02:00:00 GMT+0200 (Central European Summer Time)'
        );
    });

    it('should change its value when the form value is reset', async () => {
        render(<ExternalChanges />);
        await screen.findByText('"2021-09-11" (string)');
        const input = screen.getByLabelText('Published at') as HTMLInputElement;
        fireEvent.change(input, {
            target: { value: '2021-10-30' },
        });
        fireEvent.blur(input);
        await screen.findByText('"2021-10-30" (string)');
        fireEvent.click(screen.getByText('Reset'));
        await screen.findByText('"2021-09-11" (string)');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            render(<Basic dateInputProps={{ validate: required() }} />);
            expect(screen.queryByText('Required')).toBeNull();
        });

        it('should be displayed if field has been touched and is invalid', async () => {
            render(
                <Basic
                    simpleFormProps={{ mode: 'onBlur' }}
                    dateInputProps={{ validate: required() }}
                />
            );

            const input = screen.getByLabelText('Published at *');
            fireEvent.blur(input);
            await screen.findByText('Required');
        });
    });
});
