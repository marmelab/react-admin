import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
    RecordContextProvider,
    minLength,
    required,
    testDataProvider,
} from 'ra-core';

import { AdminContext } from '../../AdminContext';
import { SimpleForm } from '../../form';
import { NumberInput } from '../NumberInput';
import { TextInput } from '../TextInput';
import { ArrayInput } from './ArrayInput';
import { SimpleFormIterator } from './SimpleFormIterator';
import { useFormContext } from 'react-hook-form';
import { GlobalValidation, ValidationInFormTab } from './ArrayInput.stories';

describe('<ArrayInput />', () => {
    it('should pass its record props to its child', async () => {
        let childProps;
        const MockChild = props => {
            childProps = props;
            return null;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <ArrayInput source="foo" record={{ iAmRecord: true }}>
                        <MockChild />
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(childProps.record).toEqual({
                iAmRecord: true,
            });
        });
    });

    it('should pass array functions to child', async () => {
        let childProps;
        const MockChild = props => {
            childProps = props;
            return null;
        };
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn}
                    defaultValues={{
                        foo: [{ id: 1 }, { id: 2 }],
                    }}
                >
                    <ArrayInput source="foo">
                        <MockChild />
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(childProps.fields.length).toEqual(2);
        });
    });

    it('should not create any section subform when the value is undefined', () => {
        const { baseElement } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <ArrayInput source="foo">
                        <SimpleFormIterator />
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        expect(baseElement.querySelectorAll('section')).toHaveLength(0);
    });

    it('should create one section subform per value in the array', async () => {
        const { baseElement } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn}
                    defaultValues={{
                        foo: [{}, {}, {}],
                    }}
                >
                    <ArrayInput source="foo">
                        <SimpleFormIterator />
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(baseElement.querySelectorAll('section')).toHaveLength(3);
        });
    });

    it('should clone each input once per value in the array', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn}
                    defaultValues={{
                        arr: [
                            { id: 123, foo: 'bar' },
                            { id: 456, foo: 'baz' },
                        ],
                    }}
                >
                    <ArrayInput resource="bar" source="arr">
                        <SimpleFormIterator>
                            <NumberInput source="id" />
                            <TextInput source="foo" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        expect(
            screen.queryAllByLabelText('resources.bar.fields.arr.id')
        ).toHaveLength(2);
        expect(
            screen
                .queryAllByLabelText('resources.bar.fields.arr.id')
                .map(input => (input as HTMLInputElement).value)
        ).toEqual(['123', '456']);
        expect(
            screen.queryAllByLabelText('resources.bar.fields.arr.foo')
        ).toHaveLength(2);
        expect(
            screen
                .queryAllByLabelText('resources.bar.fields.arr.foo')
                .map(input => (input as HTMLInputElement).value)
        ).toEqual(['bar', 'baz']);
    });

    it('should apply validation to both itself and its inner inputs', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn}
                    defaultValues={{
                        arr: [],
                    }}
                >
                    <ArrayInput
                        resource="bar"
                        source="arr"
                        validate={[minLength(2, 'array_min_length')]}
                    >
                        <SimpleFormIterator>
                            <TextInput
                                source="id"
                                validate={[required('id_required')]}
                            />
                            <TextInput
                                source="foo"
                                validate={[required('foo_required')]}
                            />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        fireEvent.click(screen.getByLabelText('ra.action.add'));
        fireEvent.click(screen.getByText('ra.action.save'));
        await waitFor(() => {
            expect(screen.queryByText('array_min_length')).not.toBeNull();
        });
        fireEvent.click(screen.getByLabelText('ra.action.add'));
        const firstId = screen.getAllByLabelText(
            'resources.bar.fields.arr.id *'
        )[0];
        fireEvent.change(firstId, {
            target: { value: 'aaa' },
        });
        fireEvent.change(firstId, {
            target: { value: '' },
        });
        fireEvent.blur(firstId);
        const firstFoo = screen.getAllByLabelText(
            'resources.bar.fields.arr.foo *'
        )[0];
        fireEvent.change(firstFoo, {
            target: { value: 'aaa' },
        });
        fireEvent.change(firstFoo, {
            target: { value: '' },
        });
        fireEvent.blur(firstFoo);
        expect(screen.queryByText('array_min_length')).toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('id_required')).not.toBeNull();
            expect(screen.queryByText('foo_required')).not.toBeNull();
        });
    });

    it('should maintain its form value after having been unmounted', async () => {
        let value, setArrayInputVisible;

        const MyArrayInput = () => {
            const [visible, setVisible] = React.useState(true);
            const { getValues } = useFormContext();
            value = jest.fn(() => getValues('arr'));
            value();

            setArrayInputVisible = setVisible;

            return visible ? (
                <ArrayInput resource="bar" source="arr">
                    <SimpleFormIterator>
                        <TextInput source="id" />
                        <TextInput source="foo" />
                    </SimpleFormIterator>
                </ArrayInput>
            ) : null;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm
                    onSubmit={jest.fn}
                    defaultValues={{
                        arr: [
                            { id: 1, foo: 'bar' },
                            { id: 2, foo: 'baz' },
                        ],
                    }}
                >
                    <MyArrayInput />
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(value.mock.results[0].value).toEqual([
                { id: 1, foo: 'bar' },
                { id: 2, foo: 'baz' },
            ]);
        });

        setArrayInputVisible(false);

        await waitFor(() => {
            expect(value.mock.results[0].value).toEqual([
                { id: 1, foo: 'bar' },
                { id: 2, foo: 'baz' },
            ]);
        });
    });

    it('should allow to have a helperText', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm onSubmit={jest.fn}>
                    <ArrayInput source="foo" helperText="test helper text">
                        <SimpleFormIterator />
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );
        expect(screen.queryByText('test helper text')).not.toBeNull();
    });

    it('should update the form state to dirty, and allow submit, on updating an array input with default value', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                {/**
                 * RecordContextProvider - required to mimic instantiating a form with default data so that the it reset by
                 * a react admin lifecycle and giving a non dirty form state. This in turn means the submit button is disabled on first render.
                 */}
                <RecordContextProvider value={{ foo: 'bar' }}>
                    <SimpleForm onSubmit={jest.fn}>
                        <ArrayInput source="arr" defaultValue={[{ id: 'foo' }]}>
                            <SimpleFormIterator>
                                <TextInput source="id" />
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </RecordContextProvider>
            </AdminContext>
        );

        const submitButton = screen
            .getByLabelText('ra.action.save')
            .closest('button');

        await waitFor(() => {
            expect(submitButton?.disabled).toBe(true);
        });

        const firstArrayInput = screen.getByDisplayValue('foo');

        userEvent.type(firstArrayInput, 'bar');

        await waitFor(() => {
            expect(submitButton?.disabled).toBe(false);
        });
    });

    describe('used within a form with global validation', () => {
        it('should display an error if the array is required and empty', async () => {
            render(<GlobalValidation />);
            await screen.findByDisplayValue('Leo Tolstoy');
            const RemoveButtons = screen.getAllByLabelText('Remove');
            fireEvent.click(RemoveButtons[1]);
            fireEvent.click(RemoveButtons[0]);
            const SaveButton = screen.getByText('Save');
            fireEvent.click(SaveButton);
            await screen.findByText(
                'The form is not valid. Please check for errors'
            );
        });
        it('should display an error if one of the required field is empty', async () => {
            render(<GlobalValidation />);
            await screen.findByDisplayValue('Leo Tolstoy');
            fireEvent.change(screen.queryAllByLabelText('Name *')[0], {
                target: { value: '' },
            });
            const SaveButton = screen.getByText('Save');
            fireEvent.click(SaveButton);
            await screen.findByText('A name is required');
        });
        it('should clear the error right after it has been fixed after submission', async () => {
            render(<GlobalValidation />);
            await screen.findByDisplayValue('Leo Tolstoy');
            fireEvent.change(screen.queryAllByLabelText('Name *')[0], {
                target: { value: '' },
            });
            const SaveButton = screen.getByText('Save');
            fireEvent.click(SaveButton);
            await screen.findByText('A name is required');
            fireEvent.change(screen.queryAllByLabelText('Name *')[0], {
                target: { value: 'Leo Dicaprio' },
            });
            await waitFor(() => {
                expect(screen.queryByText('A name is required')).toBeNull();
            });
        });
        it('should turn form tab in red if the array is required and empty', async () => {
            render(<ValidationInFormTab />);
            const input = screen.getByLabelText('Title');
            userEvent.type(input, 'a');
            const SaveButton = screen.getByText('Save');
            fireEvent.click(SaveButton);
            const formTab = await screen.findByText('Main');
            expect(
                formTab.classList.contains('RaTabbedForm-errorTabButton')
            ).toBe(true);
            expect(formTab.classList.contains('error')).toBe(true);
        });
    });
});
