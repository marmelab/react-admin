import { render, cleanup } from 'react-testing-library';
import React from 'react';
import { renderWithRedux } from 'ra-core';

import SimpleForm, { SimpleForm as SimpleFormView } from './SimpleForm';
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

        expect(queryByLabelText('Name')).not.toBeNull();
        expect(queryByLabelText('City')).not.toBeNull();
    });

    it('should display <Toolbar />', () => {
        const Toolbar = () => <p>TOOLBAR</p>;

        const { queryByText } = render(
            <SimpleFormView toolbar={<Toolbar />} />
        );
        expect(queryByText('TOOLBAR')).not.toBeNull();
    });

    it('should pass submitOnEnter to <Toolbar />', () => {
        const handleSubmit = () => {};
        const Toolbar = ({ submitOnEnter }) => (
            <p>submitOnEnter: {submitOnEnter.toString()}</p>
        );

        const { queryByText, rerender } = render(
            <SimpleFormView
                submitOnEnter={false}
                handleSubmit={handleSubmit}
                toolbar={<Toolbar />}
            />
        );

        expect(queryByText('submitOnEnter: false')).not.toBeNull();

        rerender(
            <SimpleFormView
                submitOnEnter
                handleSubmit={handleSubmit}
                toolbar={<Toolbar />}
            />
        );

        expect(queryByText('submitOnEnter: true')).not.toBeNull();
    });
});
