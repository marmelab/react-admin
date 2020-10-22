import { cleanup } from '@testing-library/react';
import * as React from 'react';
import expect from 'expect';
import { renderWithRedux, SideEffectContextProvider } from 'ra-core';

import SimpleForm from './SimpleForm';
import TextInput from '../input/TextInput';

describe('<SimpleForm />', () => {
    afterEach(cleanup);

    const saveContext = {};
    it('should embed a form with given component children', () => {
        const { queryByLabelText } = renderWithRedux(
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="city" />
                </SimpleForm>
            </SideEffectContextProvider>
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
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm>
                    <TextInput source="name" />
                    <TextInput source="city" />
                </SimpleForm>
            </SideEffectContextProvider>
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const Toolbar = ({ submitOnEnter }: any): any => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = renderWithRedux(
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm submitOnEnter={false} toolbar={<Toolbar />}>
                    <div />
                </SimpleForm>
            </SideEffectContextProvider>
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm submitOnEnter toolbar={<Toolbar />}>
                    <div />
                </SimpleForm>
            </SideEffectContextProvider>
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText } = renderWithRedux(
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm>
                    <TextInput source="name" />
                </SimpleForm>
            </SideEffectContextProvider>
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
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm variant="outlined" margin="normal">
                    <TextInput source="name" />
                </SimpleForm>
            </SideEffectContextProvider>
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
            <SideEffectContextProvider value={saveContext}>
                <SimpleForm variant="standard" margin="none">
                    <TextInput
                        source="name"
                        variant="outlined"
                        margin="normal"
                    />
                </SimpleForm>
            </SideEffectContextProvider>
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
