import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { NumberField } from './NumberField';

describe('<NumberField />', () => {
    test('should return null when the record is not set', () =>
        assert.equal(shallow(<NumberField source="foo" />).html(), null));

    test('should return null when the record has no value for the source', () =>
        assert.equal(
            shallow(<NumberField record={{}} source="foo" />).html(),
            null
        ));

    test('should render a number', () => {
        const wrapper = shallow(
            <NumberField record={{ foo: 1 }} source="foo" />
        );
        assert.equal(wrapper.text(), '1');
    });

    test('should pass the options prop to Intl.NumberFormat', () => {
        const wrapper = shallow(
            <NumberField
                record={{ foo: 1 }}
                source="foo"
                locales="en-US"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        assert.equal(wrapper.text(), '1.00');
    });

    test('should use the locales props as an argument to Intl.NumberFormat', () => {
        const wrapper = shallow(
            <NumberField
                record={{ foo: 1 }}
                source="foo"
                locales="fr-FR"
                options={{ minimumFractionDigits: 2 }}
            />
        );
        assert.equal(wrapper.text(), '1,00');
    });

    test('should use custom className', () =>
        assert.deepEqual(
            shallow(
                <NumberField
                    record={{ foo: true }}
                    source="foo"
                    className="foo"
                />
            ).prop('className'),
            'foo'
        ));

    test('should handle deep fields', () => {
        const wrapper = shallow(
            <NumberField record={{ foo: { bar: 2 } }} source="foo.bar" />
        );

        assert.equal(wrapper.text(), '2');
    });
});
