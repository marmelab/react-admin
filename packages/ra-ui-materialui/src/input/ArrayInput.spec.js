import React from 'react';
import { shallow, mount } from 'enzyme';
import { reduxForm, reducer as formReducer } from 'redux-form';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { TranslationProvider } from 'ra-core';

import { ArrayInput } from './ArrayInput';
import NumberInput from './NumberInput';
import TextInput from './TextInput';
import SimpleFormIterator from '../form/SimpleFormIterator';

const AppMock = ({ children }) => (
    <Provider
        store={createStore(
            combineReducers({
                form: formReducer,
                i18n: () => ({ locale: 'en', messages: {} }),
            })
        )}
    >
        <TranslationProvider>{children}</TranslationProvider>
    </Provider>
);

describe('<ArrayInput />', () => {
    it('should render a FieldArray', () => {
        const wrapper = shallow(<ArrayInput source="arr" record={{}} />);
        expect(
            wrapper.find('TranslatedComponent(pure(FieldTitle))').length
        ).toBe(1);
        expect(wrapper.find('FieldArray').length).toBe(1);
    });

    it('should pass an undefined fields to child when initialized with an undefined value', () => {
        const MockChild = () => <span />;
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo">
                    <MockChild />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const wrapper = mount(
            <AppMock>
                <DummyFormRF />
            </AppMock>
        );
        expect(
            wrapper
                .find('MockChild')
                .prop('fields')
                .getAll()
        ).toBeUndefined();
    });

    it('should pass its record props to its child', () => {
        const MockChild = () => <span />;
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo" record="record">
                    <MockChild />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const wrapper = mount(
            <AppMock>
                <DummyFormRF />
            </AppMock>
        );
        expect(wrapper.find(MockChild).props().record).toBe('record');
    });

    it('should pass redux-form fields to child', () => {
        const MockChild = () => <span />;
        const DummyForm = () => (
            <form>
                <ArrayInput source="foo">
                    <MockChild />
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const wrapper = mount(
            <AppMock>
                <DummyFormRF
                    initialValues={{
                        foo: [{ id: 1 }, { id: 2 }],
                    }}
                />
            </AppMock>
        );
        expect(
            wrapper
                .find('MockChild')
                .prop('fields')
                .getAll()
        ).toEqual([{ id: 1 }, { id: 2 }]);
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
        const wrapper = mount(
            <AppMock>
                <DummyFormRF />
            </AppMock>
        );
        expect(wrapper.find('section').length).toBe(0);
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
        const wrapper = mount(
            <AppMock>
                <DummyFormRF
                    initialValues={{
                        foo: [{}, {}, {}],
                    }}
                />
            </AppMock>
        );
        expect(wrapper.find('section').length).toBe(3);
    });

    it('should clone each input once per value in the array', () => {
        const DummyForm = () => (
            <form>
                <ArrayInput source="arr">
                    <SimpleFormIterator>
                        <NumberInput source="id" />
                        <TextInput source="foo" />
                    </SimpleFormIterator>
                </ArrayInput>
            </form>
        );
        const DummyFormRF = reduxForm({ form: 'record-form' })(DummyForm);
        const wrapper = mount(
            <AppMock>
                <DummyFormRF
                    initialValues={{
                        arr: [{ id: 123, foo: 'bar' }, { id: 456, foo: 'baz' }],
                    }}
                />
            </AppMock>
        );
        expect(wrapper.find('NumberInput').length).toBe(2);
        expect(
            wrapper
                .find('NumberInput')
                .at(0)
                .prop('input').value
        ).toBe(123);
        expect(
            wrapper
                .find('NumberInput')
                .at(1)
                .prop('input').value
        ).toBe(456);
        expect(wrapper.find('TextInput').length).toBe(2);
        expect(
            wrapper
                .find('TextInput')
                .at(0)
                .prop('input').value
        ).toBe('bar');
        expect(
            wrapper
                .find('TextInput')
                .at(1)
                .prop('input').value
        ).toBe('baz');
    });
});
