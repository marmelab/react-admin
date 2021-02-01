import * as React from 'react';
import expect from 'expect';
import { Form } from 'react-final-form';
import { render, fireEvent } from '@testing-library/react';
import FormField from './FormField';

describe('<FormField>', () => {
    // disable deprecation warnings
    let consoleSpy;
    beforeAll(() => {
        consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    });
    afterAll(() => {
        consoleSpy.restore();
    });

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
        expect(formApi.getState().values.title).toEqual('Lorem');
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
        expect(formApi.getState().values.title).not.toEqual('Lorem');
    });
});
