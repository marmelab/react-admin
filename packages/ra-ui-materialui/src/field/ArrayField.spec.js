import React from 'react';
import { shallow, mount } from 'enzyme';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { TranslationProvider } from 'ra-core';

import { ArrayField } from './ArrayField';
import NumberField from './NumberField';
import TextField from './TextField';
import Datagrid from '../list/Datagrid';

describe('<ArrayField />', () => {
    it('should not fail for empty records', () => {
        const IteratorMock = jest.fn();
        shallow(
            <ArrayField source="arr" record={{}}>
                <IteratorMock />
            </ArrayField>
        ).dive();
        expect(IteratorMock.mock.calls.length).toBe(1);
        expect(IteratorMock.mock.calls[0][0]).toMatchObject({
            data: {},
            ids: [],
        });
    });

    it('should pass the embedded array as data and ids props to child', () => {
        const IteratorMock = jest.fn();
        shallow(
            <ArrayField
                source="arr"
                record={{
                    arr: [{ id: 123, foo: 'bar' }, { id: 456, foo: 'baz' }],
                }}
            >
                <IteratorMock />
            </ArrayField>
        ).dive();
        expect(IteratorMock.mock.calls.length).toBe(1);
        expect(IteratorMock.mock.calls[0][0]).toMatchObject({
            data: {
                '{"id":123,"foo":"bar"}': { foo: 'bar', id: 123 },
                '{"id":456,"foo":"baz"}': { foo: 'baz', id: 456 },
            },
            ids: ['{"id":123,"foo":"bar"}', '{"id":456,"foo":"baz"}'],
        });
    });

    it('should render the underlying iterator component', () => {
        const store = createStore(
            combineReducers({
                i18n: () => ({ locale: 'en', messages: {} }),
            })
        );
        const Dummy = () => (
            <ArrayField
                source="arr"
                record={{
                    arr: [{ id: 123, foo: 'bar' }, { id: 456, foo: 'baz' }],
                }}
            >
                <Datagrid>
                    <NumberField source="id" />
                    <TextField source="foo" />
                </Datagrid>
            </ArrayField>
        );
        const wrapper = mount(
            <Provider store={store}>
                <TranslationProvider>
                    <Dummy />
                </TranslationProvider>
            </Provider>
        );
        expect(
            wrapper
                .find('TextField span')
                .at(0)
                .text()
        ).toBe('bar');
        expect(
            wrapper
                .find('NumberField span')
                .at(0)
                .text()
        ).toBe('123');
        expect(
            wrapper
                .find('TextField span')
                .at(1)
                .text()
        ).toBe('baz');
        expect(
            wrapper
                .find('NumberField span')
                .at(1)
                .text()
        ).toBe('456');
    });
});
