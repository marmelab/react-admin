import * as React from 'react';
import expect from 'expect';
import { testDataProvider } from 'ra-core';
import { render, screen, waitFor } from '@testing-library/react';
import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import { TextInput } from '../input';
import { AdminContext } from '../AdminContext';

describe('<FormTab label="foo" />', () => {
    it('should display <Toolbar />', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab label="foo">
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(screen.queryByLabelText('ra.action.save')).not.toBeNull();
        });
    });

    it('should not alter default margin or variant', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab label="foo">
                        <TextInput source="name" />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        const inputElement = screen.queryByLabelText(
            'resources.undefined.fields.name'
        );
        await waitFor(() => {
            expect(inputElement.classList).toContain('MuiFilledInput-input');
        });
        expect(inputElement.parentElement.parentElement.classList).toContain(
            'MuiFormControl-marginDense'
        );
    });

    it('should render a TabbedForm with FormTabs having custom props without warnings', async () => {
        let countWarnings = 0;
        const spy = jest
            .spyOn(console, 'error')
            .mockImplementation((message: string) => {
                if (!message.includes('a test was not wrapped in act')) {
                    countWarnings++;
                }
            });

        const record = { id: 'gazebo', name: 'foo' };

        const { container } = render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab
                        label="First"
                        resource="posts"
                        record={record}
                        margin="none"
                        variant="standard"
                    >
                        <TextInput source="name" />
                    </FormTab>
                    <FormTab
                        label="Second"
                        resource="posts"
                        record={record}
                        margin="dense"
                        variant="filled"
                    >
                        <TextInput source="name" />
                    </FormTab>
                    <FormTab
                        label="Third"
                        resource="posts"
                        record={record}
                        margin="normal"
                        variant="outlined"
                    >
                        <TextInput source="name" />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        await waitFor(() => {
            expect(countWarnings).toEqual(0);
        });
        expect(container).not.toBeNull();

        spy.mockRestore();
    });

    it('should pass variant and margin to child inputs', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab label="foo" variant="outlined" margin="normal">
                        <TextInput source="name" />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        const inputElement = screen.queryByLabelText(
            'resources.undefined.fields.name'
        );
        await waitFor(() => {
            expect(inputElement.classList).toContain('MuiOutlinedInput-input');
        });
        expect(inputElement.parentElement.parentElement.classList).toContain(
            'MuiFormControl-marginNormal'
        );
    });

    it('should allow input children to override variant and margin', async () => {
        render(
            <AdminContext dataProvider={testDataProvider()}>
                <TabbedForm>
                    <FormTab label="foo" variant="standard" margin="none">
                        <TextInput
                            source="name"
                            variant="outlined"
                            margin="normal"
                        />
                    </FormTab>
                </TabbedForm>
            </AdminContext>
        );
        const inputElement = screen.queryByLabelText(
            'resources.undefined.fields.name'
        );
        await waitFor(() => {
            expect(inputElement.classList).toContain('MuiOutlinedInput-input');
        });
        expect(inputElement.parentElement.parentElement.classList).toContain(
            'MuiFormControl-marginNormal'
        );
    });
});
