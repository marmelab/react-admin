import { cleanup } from '@testing-library/react';
import React from 'react';
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
});
