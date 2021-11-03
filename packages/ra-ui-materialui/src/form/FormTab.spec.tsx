import * as React from 'react';
import expect from 'expect';
import { waitFor } from '@testing-library/react';
import { SaveContextProvider, SideEffectContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import { TextInput } from '../input';
import { defaultTheme } from '../defaultTheme';

describe('<FormTab label="foo" />', () => {
    const saveContextValue = {
        save: jest.fn(),
        saving: false,
        setOnFailure: jest.fn(),
    };
    const sideEffectValue = {};

    it('should display <Toolbar />', () => {
        const { queryByLabelText, unmount } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm>
                            <FormTab label="foo">
                                <TextInput source="name" />
                                <TextInput source="city" />
                            </FormTab>
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
        expect(
            queryByLabelText('resources.undefined.fields.name')
        ).not.toBeNull();
        unmount();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText, unmount } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm>
                            <FormTab label="foo">
                                <TextInput source="name" />
                            </FormTab>
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        const inputElement = queryByLabelText(
            'resources.undefined.fields.name'
        );
        expect(inputElement.classList).toContain('MuiFilledInput-input');
        expect(inputElement.parentElement.parentElement.classList).toContain(
            'MuiFormControl-marginDense'
        );
        unmount();
    });

    it('should render a TabbedForm with FormTabs having custom props without warnings', async () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const record = { id: 'gazebo', name: 'foo' };
        const {
            container,
            queryByLabelText,
            queryByDisplayValue,
        } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm defaultValues={record}>
                            <FormTab
                                label="First"
                                basePath="/posts"
                                resource="posts"
                                record={record}
                                margin="none"
                                variant="standard"
                            >
                                <TextInput source="name" />
                            </FormTab>
                            <FormTab
                                label="Second"
                                basePath="/posts"
                                resource="posts"
                                record={record}
                                margin="dense"
                                variant="filled"
                            >
                                <TextInput source="first_name" />
                            </FormTab>
                            <FormTab
                                label="Third"
                                basePath="/posts"
                                resource="posts"
                                record={record}
                                margin="normal"
                                variant="outlined"
                            >
                                <TextInput source="last_name" />
                            </FormTab>
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );

        await waitFor(() => {
            expect(queryByLabelText('First')).not.toBeNull();
        });
        expect(queryByLabelText('Second')).not.toBeNull();
        expect(queryByLabelText('Third')).not.toBeNull();

        await waitFor(() => {
            expect(queryByDisplayValue('foo')).not.toBeNull();
        });
        expect(spy).not.toHaveBeenCalled();
        expect(container).not.toBeNull();

        spy.mockRestore();
    });

    it('should pass variant and margin to child inputs', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm>
                            <FormTab
                                label="foo"
                                variant="outlined"
                                margin="normal"
                            >
                                <TextInput source="name" />
                            </FormTab>
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        const inputElement = queryByLabelText(
            'resources.undefined.fields.name'
        );
        expect(inputElement.classList).toContain('MuiOutlinedInput-input');
        expect(inputElement.parentElement.parentElement.classList).toContain(
            'MuiFormControl-marginNormal'
        );
    });

    it('should allow input children to override variant and margin', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SideEffectContextProvider value={sideEffectValue}>
                        <TabbedForm>
                            <FormTab
                                label="foo"
                                variant="standard"
                                margin="none"
                            >
                                <TextInput
                                    source="name"
                                    variant="outlined"
                                    margin="normal"
                                />
                            </FormTab>
                        </TabbedForm>
                    </SideEffectContextProvider>
                </SaveContextProvider>
            </ThemeProvider>
        );
        const inputElement = queryByLabelText(
            'resources.undefined.fields.name'
        );
        expect(inputElement.classList).toContain('MuiOutlinedInput-input');
        expect(inputElement.parentElement.parentElement.classList).toContain(
            'MuiFormControl-marginNormal'
        );
    });
});
