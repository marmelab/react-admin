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
import { Form, ResourceContextProvider } from '..';

describe('FormDataConsumerView', () => {
    it('does not call its children function with scopedFormData if it did not receive a source containing an index', () => {
        const children = jest.fn();
        const formData = { id: 123, title: 'A title' };

        render(
            <Form>
                <FormDataConsumerView
                    form="a-form"
                    formData={formData}
                    source="a-field"
                >
                    {children}
                </FormDataConsumerView>
            </Form>
        );

        expect(children).toHaveBeenCalledWith({
            formData,
        });
    });

    it('calls its children with updated formData on first render', async () => {
        let globalFormData;
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <BooleanInput source="hi" defaultValue />
                        <FormDataConsumer>
                            {({ formData }) => {
                                globalFormData = formData;

                                return <TextInput source="bye" />;
                            }}
                        </FormDataConsumer>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(globalFormData).toEqual({ hi: true, bye: undefined });
        });
    });

    it('should be reactive', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <BooleanInput source="hi" defaultValue />
                        <FormDataConsumer>
                            {({ formData }) =>
                                !formData.hi ? <TextInput source="bye" /> : null
                            }
                        </FormDataConsumer>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        await waitFor(() => {
            expect(
                screen.queryByLabelText('resources.posts.fields.bye')
            ).toBeNull();
        });

        fireEvent.click(screen.getByLabelText('resources.posts.fields.hi'));

        await waitFor(() => {
            expect(
                screen.getByLabelText('resources.posts.fields.bye')
            ).not.toBeNull();
        });
    });

    it('calls its children with updated scopedFormData when inside an ArrayInput', async () => {
        let globalScopedFormData;
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <ArrayInput source="authors">
                            <SimpleFormIterator>
                                <TextInput source="name" />
                                <FormDataConsumer>
                                    {({ scopedFormData }) => {
                                        globalScopedFormData = scopedFormData;
                                        return scopedFormData &&
                                            scopedFormData.name ? (
                                            <TextInput source="role" />
                                        ) : null;
                                    }}
                                </FormDataConsumer>
                            </SimpleFormIterator>
                        </ArrayInput>
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );

        expect(globalScopedFormData).toEqual(undefined);

        fireEvent.click(screen.getByLabelText('ra.action.add'));

        expect(globalScopedFormData).toEqual({ name: null });

        fireEvent.change(
            screen.getByLabelText('resources.posts.fields.authors.name'),
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
