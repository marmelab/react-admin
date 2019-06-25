import React from 'react';
import { render } from 'react-testing-library';
import { reduxForm } from 'redux-form';
import { TestContext } from 'ra-core';

import ArrayInput from './ArrayInput';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import SimpleFormIterator from '../form/SimpleFormIterator';

describe('<ArrayInput />', () => {
    it('should pass its record props to its child', () => {
        const MockChild = jest.fn(() => <span />);
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo" record={{ iAmRecord: true }}>
                    <MockChild />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        render(
            <TestContext>
                <DummyFormRF />
            </TestContext>
        );
        expect(MockChild.mock.calls[0][0].record).toEqual({
            iAmRecord: true,
        });
    });

    it('should pass redux-form fields to child', () => {
        const MockChild = jest.fn(() => <span />);
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo">
                    <MockChild />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        render(
            <TestContext enableReducers={true}>
                <DummyFormRF
                    initialValues={{
                        foo: [{ id: 1 }, { id: 2 }],
                    }}
                />
            </TestContext>
        );

        expect(MockChild.mock.calls[0][0].fields.getAll()).toEqual([
            { id: 1 },
            { id: 2 },
        ]);
    });

    it('should not create any section subform when the value is undefined', () => {
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo">
                    <SimpleFormIterator />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const { baseElement } = render(
            <TestContext>
                <DummyFormRF />
            </TestContext>
        );
        expect(baseElement.querySelectorAll('section')).toHaveLength(0);
    });

    it('should create one section subform per value in the array', () => {
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo">
                    <SimpleFormIterator />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const { baseElement } = render(
            <TestContext enableReducers={true}>
                <DummyFormRF
                    initialValues={{
                        foo: [{}, {}, {}],
                    }}
                />
            </TestContext>
        );
        expect(baseElement.querySelectorAll('section')).toHaveLength(3);
    });

    it('should clone each input once per value in the array', () => {
        const DummyForm = () => (
            <form>
                <ArrayInput resource="bar" source="arr">
                    <SimpleFormIterator>
                        <NumberInput source="id" />
                        <TextInput source="foo" />
                    </SimpleFormIterator>
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const { queryAllByLabelText } = render(
            <TestContext enableReducers={true}>
                <DummyFormRF
                    initialValues={{
                        arr: [{ id: 123, foo: 'bar' }, { id: 456, foo: 'baz' }],
                    }}
                />
            </TestContext>
        );
        expect(queryAllByLabelText('id')).toHaveLength(2);
        expect(queryAllByLabelText('id').map(input => input.value)).toEqual([
            '123',
            '456',
        ]);
        expect(queryAllByLabelText('foo')).toHaveLength(2);
        expect(queryAllByLabelText('foo').map(input => input.value)).toEqual([
            'bar',
            'baz',
        ]);
    });
});
