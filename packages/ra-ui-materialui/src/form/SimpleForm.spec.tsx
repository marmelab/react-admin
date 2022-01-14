import * as React from 'react';
import expect from 'expect';
import { SaveContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { defaultTheme } from '../defaultTheme';
import { SimpleForm } from './SimpleForm';
import { TextInput } from '../input';

describe('<SimpleForm />', () => {
    const saveContextValue = {
        save: jest.fn(),
        saving: false,
    };

    it('should embed a form with given component children', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SimpleForm>
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </SimpleForm>
                </SaveContextProvider>
            </ThemeProvider>
        );
        expect(
            queryByLabelText('resources.undefined.fields.name')
        ).not.toBeNull();
        expect(
            queryByLabelText('resources.undefined.fields.city')
        ).not.toBeNull();
    });

    it('should display <Toolbar />', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SimpleForm>
                        <TextInput source="name" />
                        <TextInput source="city" />
                    </SimpleForm>
                </SaveContextProvider>
            </ThemeProvider>
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any): any => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SimpleForm submitOnEnter={false} toolbar={<Toolbar />}>
                        <TextInput source="name" />
                    </SimpleForm>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SimpleForm submitOnEnter toolbar={<Toolbar />}>
                        <TextInput source="name" />
                    </SimpleForm>
                </SaveContextProvider>
            </ThemeProvider>
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SimpleForm>
                        <TextInput source="name" />
                    </SimpleForm>
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

    it('should pass variant and margin to child inputs', () => {
        const { queryByLabelText } = renderWithRedux(
            <ThemeProvider theme={createTheme(defaultTheme)}>
                <SaveContextProvider value={saveContextValue}>
                    <SimpleForm variant="outlined" margin="normal">
                        <TextInput source="name" />
                    </SimpleForm>
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
                    <SimpleForm variant="standard" margin="none">
                        <TextInput
                            source="name"
                            variant="outlined"
                            margin="normal"
                        />
                    </SimpleForm>
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
