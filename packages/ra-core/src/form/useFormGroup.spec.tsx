import React from 'react';
import { getFormGroupState, useFormGroup } from './useFormGroup';
import {
    AdminContext,
    ArrayInput,
    SimpleForm,
    SimpleFormIterator,
    TextInput,
} from 'ra-ui-materialui';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { FormGroupContextProvider } from './FormGroupContextProvider';
import { testDataProvider } from '../dataProvider';
import { ResourceContextProvider } from '..';

describe('useFormGroup', () => {
    test.each([
        [
            'some fields are dirty and invalid',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    isValidating: false,
                    name: 'title',
                },
                {
                    isValid: false,
                    isDirty: true,
                    isTouched: true,
                    isValidating: false,
                    error: 'Invalid',
                    name: 'description',
                },
            ],
            {
                isValid: false,
                isDirty: true,
                isTouched: true,
                isValidating: false,
                errors: {
                    description: 'Invalid',
                },
            },
        ],
        [
            'none of the fields is invalid nor dirty',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    isValidating: false,
                    name: 'title',
                },
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    isValidating: false,
                    name: 'description',
                },
            ],
            {
                isValid: true,
                isDirty: false,
                isTouched: false,
                isValidating: false,
                errors: {},
            },
        ],
        [
            'none of the fields is invalid but some are dirty',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    isValidating: false,
                    name: 'title',
                },
                {
                    isValid: true,
                    isDirty: true,
                    isTouched: true,
                    isValidating: false,
                    name: 'description',
                },
            ],
            {
                isValid: true,
                isDirty: true,
                isTouched: true,
                isValidating: false,
                errors: {},
            },
        ],
    ])(
        'should return a correct form group state when %s',
        (_, fieldStates, expectedGroupState) => {
            expect(getFormGroupState(fieldStates)).toEqual(expectedGroupState);
        }
    );

    it('should return correct group state', async () => {
        let state;
        const IsDirty = () => {
            state = useFormGroup('simplegroup');
            return null;
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm mode="onChange">
                        <FormGroupContextProvider name="simplegroup">
                            <IsDirty />
                            <TextInput source="url" />
                        </FormGroupContextProvider>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: false,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });

        const input = screen.getByLabelText('resources.posts.fields.url');
        fireEvent.change(input, {
            target: { value: 'test' },
        });
        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: true,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });
        // This is coherent with how react-hook-form works, inputs are only touched when they lose focus
        fireEvent.blur(input);
        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: true,
                isTouched: true,
                isValid: true,
                isValidating: false,
            });
        });
    });

    it('should return the correct group state when the group changes', async () => {
        let state;
        const IsDirty = () => {
            const [group, setGroup] = React.useState('simplegroup');
            state = useFormGroup(group);
            return (
                <button onClick={() => setGroup('simplegroup2')}>
                    Change group
                </button>
            );
        };

        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm mode="onChange">
                        <FormGroupContextProvider name="simplegroup">
                            <TextInput source="url" />
                        </FormGroupContextProvider>
                        <FormGroupContextProvider name="simplegroup2">
                            <TextInput source="test" />
                        </FormGroupContextProvider>
                        <IsDirty />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: false,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });

        const input = screen.getByLabelText('resources.posts.fields.url');
        fireEvent.change(input, {
            target: { value: 'test' },
        });
        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: true,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });
        fireEvent.click(screen.getByText('Change group'));
        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: false,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });
    });

    it('should return correct group state when an ArrayInput is in the group', async () => {
        let state;
        const IsDirty = () => {
            state = useFormGroup('backlinks');
            return null;
        };

        const backlinksDefaultValue = [
            {
                date: '2012-08-22T00:00:00.000Z',
                url: 'https://foo.bar.com/lorem/ipsum',
            },
        ];
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <FormGroupContextProvider name="backlinks">
                            <IsDirty />
                            <ArrayInput
                                defaultValue={backlinksDefaultValue}
                                source="backlinks"
                            >
                                <SimpleFormIterator>
                                    <TextInput source="url" />
                                    <TextInput source="date" />
                                </SimpleFormIterator>
                            </ArrayInput>
                        </FormGroupContextProvider>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: false,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });

        const addItemElement = screen
            .getByLabelText('ra.action.add')
            .closest('button') as HTMLButtonElement;

        fireEvent.click(addItemElement);
        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: true,
                isTouched: false,
                isValid: true,
                isValidating: false,
            });
        });
    });
});
