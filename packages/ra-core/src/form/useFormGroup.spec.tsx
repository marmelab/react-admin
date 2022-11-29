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

describe('useFormGroup', () => {
    test.each([
        [
            'some fields are dirty and invalid',
            [
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    name: 'title',
                },
                {
                    isValid: false,
                    isDirty: true,
                    isTouched: true,
                    error: 'Invalid',
                    name: 'description',
                },
            ],
            {
                isValid: false,
                isDirty: true,
                isTouched: true,
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
                    name: 'title',
                },
                {
                    isValid: true,
                    isDirty: false,
                    isTouched: false,
                    name: 'description',
                },
            ],
            {
                isValid: true,
                isDirty: false,
                isTouched: false,
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
                    name: 'title',
                },
                {
                    isValid: true,
                    isDirty: true,
                    isTouched: true,
                    name: 'description',
                },
            ],
            {
                isValid: true,
                isDirty: true,
                isTouched: true,
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
                <SimpleForm>
                    <FormGroupContextProvider name="simplegroup">
                        <IsDirty />
                        <TextInput source="url" />
                    </FormGroupContextProvider>
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: false,
                isTouched: false,
                isValid: true,
            });
        });

        const input = screen.getByLabelText('resources.undefined.fields.url');
        fireEvent.change(input, {
            target: { value: 'test' },
        });
        fireEvent.blur(input);
        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: true,
                isTouched: true,
                isValid: true,
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
            </AdminContext>
        );

        await waitFor(() => {
            expect(state).toEqual({
                errors: {},
                isDirty: false,
                isTouched: false,
                isValid: true,
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
            });
        });
    });
});
