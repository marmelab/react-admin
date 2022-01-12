import * as React from 'react';
import expect from 'expect';
import { SaveContextProvider } from 'ra-core';
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

    it('should display <Toolbar />', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm>
                        <FormTab label="foo">
                            <TextInput source="name" />
                            <TextInput source="city" />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </ThemeProvider>
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm>
                        <FormTab label="foo">
                            <TextInput source="name" />
                        </FormTab>
                    </TabbedForm>
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
    });

    it('should render a TabbedForm with FormTabs having custom props without warnings', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const record = { id: 'gazebo', name: 'foo' };
        const { container } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm>
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
                            <TextInput source="name" />
                        </FormTab>
                        <FormTab
                            label="Third"
                            basePath="/posts"
                            resource="posts"
                            record={record}
                            margin="normal"
                            variant="outlined"
                        >
                            <TextInput source="name" />
                        </FormTab>
                    </TabbedForm>
                </SaveContextProvider>
            </ThemeProvider>
        );
        expect(spy).not.toHaveBeenCalled();
        expect(container).not.toBeNull();

        spy.mockRestore();
    });

    it('should pass variant and margin to child inputs', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <TabbedForm>
                        <FormTab label="foo" variant="outlined" margin="normal">
                            <TextInput source="name" />
                        </FormTab>
                    </TabbedForm>
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
                    <TabbedForm>
                        <FormTab label="foo" variant="standard" margin="none">
                            <TextInput
                                source="name"
                                variant="outlined"
                                margin="normal"
                            />
                        </FormTab>
                    </TabbedForm>
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
