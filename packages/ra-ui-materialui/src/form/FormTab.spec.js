import { cleanup } from '@testing-library/react';
import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'ra-core';

import TabbedForm from './TabbedForm';
import FormTab from './FormTab';
import TextInput from '../input/TextInput';

describe('<FormTab label="foo" />', () => {
    afterEach(cleanup);

    it('should display <Toolbar />', () => {
        const { queryByLabelText } = renderWithRedux(
            <TabbedForm>
                <FormTab label="foo">
                    <TextInput source="name" />
                    <TextInput source="city" />
                </FormTab>
            </TabbedForm>
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText } = renderWithRedux(
            <TabbedForm>
                <FormTab label="foo">
                    <TextInput source="name" />
                </FormTab>
            </TabbedForm>
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
            <TabbedForm>
                <FormTab label="foo" variant="outlined" margin="normal">
                    <TextInput source="name" />
                </FormTab>
            </TabbedForm>
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
            <TabbedForm>
                <FormTab label="foo" variant="standard" margin="none">
                    <TextInput
                        source="name"
                        variant="outlined"
                        margin="normal"
                    />
                </FormTab>
            </TabbedForm>
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
