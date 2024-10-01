import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { ResourceContextProvider, testDataProvider } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { SimpleForm } from './SimpleForm';
import { TextInput } from '../input';
import { GlobalValidation, InputBasedValidation } from './SimpleForm.stories';

describe('<SimpleForm />', () => {
    it('should embed a form with given component children', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(
            screen.queryByLabelText('resources.posts.fields.name')
        ).not.toBeNull();
        expect(
            screen.queryByLabelText('resources.posts.fields.city')
        ).not.toBeNull();
    });

    it('should display <Toolbar />', () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <ResourceContextProvider value="posts">
                    <SimpleForm>
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </SimpleForm>
                </ResourceContextProvider>
            </AdminContext>
        );
        expect(screen.queryByLabelText('ra.action.save')).not.toBeNull();
    });

    describe('validation', () => {
        it('should support translations with global validation', async () => {
            const mock = jest
                .spyOn(console, 'warn')
                .mockImplementation(() => {});
            render(<GlobalValidation />);
            fireEvent.change(await screen.findByLabelText('Title'), {
                target: { value: '' },
            });
            fireEvent.change(await screen.findByLabelText('Author'), {
                target: { value: '' },
            });
            fireEvent.change(await screen.findByLabelText('Year'), {
                target: { value: '2003' },
            });
            fireEvent.click(await screen.findByLabelText('Save'));
            await screen.findByText('The title is required');
            await screen.findByText('The author is required');
            await screen.findByText('The year must be less than 2000');
            expect(mock).toHaveBeenCalledWith(
                "Missing translation for key 'The title is required'"
            );
            expect(mock).not.toHaveBeenCalledWith(
                "Missing translation for key 'The author is required'"
            );
            expect(mock).not.toHaveBeenCalledWith(
                "Missing translation for key 'The year must be less than 2000'"
            );
            mock.mockRestore();
        });

        it('should support translations with per input validation', async () => {
            const mock = jest
                .spyOn(console, 'warn')
                .mockImplementation(() => {});
            render(<InputBasedValidation />);
            fireEvent.change(await screen.findByLabelText('Title *'), {
                target: { value: '' },
            });
            fireEvent.change(await screen.findByLabelText('Author *'), {
                target: { value: '' },
            });
            fireEvent.change(await screen.findByLabelText('Year'), {
                target: { value: '2003' },
            });
            fireEvent.click(await screen.findByLabelText('Save'));
            await screen.findByText('The title is required');
            await screen.findByText('The author is required');
            await screen.findByText('The year must be less than 2000');
            expect(mock).toHaveBeenCalledWith(
                "Missing translation for key 'The title is required'"
            );
            expect(mock).not.toHaveBeenCalledWith(
                "Missing translation for key 'The author is required'"
            );
            expect(mock).not.toHaveBeenCalledWith(
                "Missing translation for key 'The year must be less than 2000'"
            );
            mock.mockRestore();
        });
    });
});
