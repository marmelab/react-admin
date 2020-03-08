import { cleanup } from '@testing-library/react';
import React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'ra-core';

import SimpleForm from './SimpleForm';
import TextInput from '../input/TextInput';

describe('<SimpleForm />', () => {
    afterEach(cleanup);

    it('should embed a form with given component children', () => {
        const { queryByLabelText } = renderWithRedux(
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="city" />
            </SimpleForm>
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
            <SimpleForm>
                <TextInput source="name" />
                <TextInput source="city" />
            </SimpleForm>
        );
        expect(queryByLabelText('ra.action.save')).not.toBeNull();
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const Toolbar = ({ submitOnEnter }) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = renderWithRedux(
            <SimpleForm
                submitOnEnter={false}
                handleSubmit={handleSubmit}
                toolbar={<Toolbar />}
            />
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <SimpleForm
                submitOnEnter
                handleSubmit={handleSubmit}
                toolbar={<Toolbar />}
            />
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });

    it('should not alter default margin or variant', () => {
        const { queryByLabelText } = renderWithRedux(
            <SimpleForm>
                <TextInput source="name" />
            </SimpleForm>
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
            <SimpleForm variant="outlined" margin="normal">
                <TextInput source="name" />
            </SimpleForm>
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
            <SimpleForm variant="standard" margin="none">
                <TextInput source="name" variant="outlined" margin="normal" />
            </SimpleForm>
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
