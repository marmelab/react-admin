import * as React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

import FormDataConsumer, { FormDataConsumerView } from './FormDataConsumer';
import { testDataProvider } from '../dataProvider';
import {
    AdminContext,
    BooleanInput,
    SimpleForm,
    TextInput,
    SimpleFormIterator,
    ArrayInput,
} from 'ra-ui-materialui';
import expect from 'expect';

describe('FormDataConsumerView', () => {
    it('does not call its children function with scopedFormData and getSource if it did not receive an index prop', () => {
        const children = jest.fn();
        const formData = { id: 123, title: 'A title' };

        render(
            <FormDataConsumerView
                form="a-form"
                formData={formData}
                source="a-field"
            >
                {children}
            </FormDataConsumerView>
        );

        expect(children).toHaveBeenCalledWith({
            formData,
        });
    });

    it('calls its children function with scopedFormData and getSource if it received an index prop', () => {
        const children = jest.fn(({ getSource }) => {
            getSource('id');
            return null;
        });
        const formData = { id: 123, title: 'A title', authors: [{ id: 0 }] };

        render(
            <FormDataConsumerView
                form="a-form"
                source="authors[0]"
                index={0}
                formData={formData}
            >
                {children}
            </FormDataConsumerView>
        );

        expect(children.mock.calls[0][0].formData).toEqual(formData);
        expect(children.mock.calls[0][0].scopedFormData).toEqual({ id: 0 });
        expect(children.mock.calls[0][0].getSource('id')).toEqual(
            'authors[0].id'
        );
    });

    it('calls its children with updated formData on first render', async () => {
        let globalFormData;
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <BooleanInput source="hi" defaultValue />
                    <FormDataConsumer>
                        {({ formData, ...rest }) => {
                            globalFormData = formData;

                            return <TextInput source="bye" {...rest} />;
                        }}
                    </FormDataConsumer>
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(globalFormData).toEqual({ hi: true, bye: undefined });
        });
    });

    it('should be reactive', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <BooleanInput source="hi" defaultValue />
                    <FormDataConsumer>
                        {({ formData, ...rest }) =>
                            !formData.hi ? (
                                <TextInput source="bye" {...rest} />
                            ) : null
                        }
                    </FormDataConsumer>
                </SimpleForm>
            </AdminContext>
        );

        await waitFor(() => {
            expect(
                screen.queryByLabelText('resources.undefined.fields.bye')
            ).toBeNull();
        });

        fireEvent.click(screen.getByLabelText('resources.undefined.fields.hi'));

        await waitFor(() => {
            expect(
                screen.getByLabelText('resources.undefined.fields.bye')
            ).not.toBeNull();
        });
    });

    it('calls its children with updated scopedFormData when inside an ArrayInput', async () => {
        let globalScopedFormData;
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <SimpleForm>
                    <ArrayInput source="authors">
                        <SimpleFormIterator>
                            <TextInput source="name" />
                            <FormDataConsumer>
                                {({
                                    formData,
                                    scopedFormData,
                                    getSource,
                                    ...rest
                                }) => {
                                    globalScopedFormData = scopedFormData;
                                    return scopedFormData &&
                                        scopedFormData.name ? (
                                        <TextInput
                                            source={getSource('role')}
                                            {...rest}
                                        />
                                    ) : null;
                                }}
                            </FormDataConsumer>
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleForm>
            </AdminContext>
        );

        expect(globalScopedFormData).toEqual(undefined);

        fireEvent.click(screen.getByLabelText('ra.action.add'));

        expect(globalScopedFormData).toEqual({ name: null });

        fireEvent.change(
            screen.getByLabelText('resources.undefined.fields.authors.name'),
            {
                target: { value: 'a' },
            }
        );

        await waitFor(() => {
            expect(globalScopedFormData).toEqual({
                name: 'a',
                role: undefined,
            });
        });
    });
});
