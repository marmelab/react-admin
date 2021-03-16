import * as React from 'react';
import expect from 'expect';
import { SaveContextProvider, SideEffectContextProvider } from 'ra-core';
import { renderWithRedux } from 'ra-test';

import { TabbedForm } from './TabbedForm';
import { FormTab } from './FormTab';
import TextInput from '../input/TextInput';

describe('<FormTab label="foo" />', () => {
    const saveContextValue = {
        save: jest.fn(),
        saving: false,
        setOnFailure: jest.fn(),
    };
    const sideEffectValue = {};

    it('should display <Toolbar />', () => {
        const { queryByLabelText } = renderWithRedux(
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
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <TabbedForm>
                        <FormTab label="foo">
                            <TextInput source="name" />
                        </FormTab>
                    </TabbedForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
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
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
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
                </SideEffectContextProvider>
            </SaveContextProvider>
        );
        expect(spy).not.toHaveBeenCalled();
        expect(container).not.toBeNull();

        spy.mockRestore();
    });

    it('should pass variant and margin to child inputs', () => {
        const { queryByLabelText } = renderWithRedux(
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <TabbedForm>
                        <FormTab label="foo" variant="outlined" margin="normal">
                            <TextInput source="name" />
                        </FormTab>
                    </TabbedForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
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
            <SaveContextProvider value={saveContextValue}>
                <SideEffectContextProvider value={sideEffectValue}>
                    <TabbedForm>
                        <FormTab label="foo" variant="standard" margin="none">
                            <TextInput
                                source="name"
                                variant="outlined"
                                margin="normal"
                            />
                        </FormTab>
                    </TabbedForm>
                </SideEffectContextProvider>
            </SaveContextProvider>
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
