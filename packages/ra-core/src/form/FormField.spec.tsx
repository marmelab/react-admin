import assert from 'assert';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Form } from 'react-final-form';
import React from 'react';
import FormField from './FormField';

describe('<FormField>', () => {
    afterEach(cleanup);

    const Foo = ({ input }) => <input type="text" {...input} />;

    it('should render a <Field/> component for the input component', () => {
        let formApi;
        const { getByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ form }) => {
                    formApi = form;
                    return <FormField source="title" component={Foo} />;
                }}
            />
        );
        const input = getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Lorem' } });
        assert.equal(formApi.getState().values.title, 'Lorem');
    });

    it('should not render a <Field /> component if the field has an input', () => {
        let formApi;
        const { getByRole } = render(
            <Form
                onSubmit={jest.fn()}
                render={({ form }) => {
                    formApi = form;
                    return (
                        <FormField source="title" component={Foo} input={{}} />
                    );
                }}
            />
        );
        const input = getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Lorem' } });
        assert.notEqual(formApi.getState().values.title, 'Lorem');
    });
});
