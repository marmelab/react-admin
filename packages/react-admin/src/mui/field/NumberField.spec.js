import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { NumberField } from './NumberField';

describe('<NumberField />', () => {
    it('should return null when the record is not set', () =>
        assert.equal(shallow(<NumberField source="foo" />).html(), null));

    it('should return null when the record has no value for the source', () =>
        assert.equal(
            shallow(<NumberField record={{}} source="foo" />).html(),
            null
        ));

    it('should render a number', () =>
        assert.equal(
            shallow(<NumberField record={{ foo: 1 }} source="foo" />).html(),
            '<span>1</span>'
        ));

    it('should pass the options prop to Intl.NumberFormat', () =>
        assert.equal(
            shallow(
                <NumberField
                    record={{ foo: 1 }}
                    source="foo"
                    locales="en-US"
                    options={{ minimumFractionDigits: 2 }}
                />
            ).html(),
            '<span>1.00</span>'
        ));

    it('should use the locales props as an argument to Intl.NumberFormat', () =>
        assert.equal(
            shallow(
                <NumberField
                    record={{ foo: 1 }}
                    source="foo"
                    locales="fr-FR"
                    options={{ minimumFractionDigits: 2 }}
                />
            ).html(),
            '<span>1,00</span>'
        ));

    it('should use custom styles passed as an elStyle prop', () =>
        assert.equal(
            shallow(
                <NumberField
                    record={{ foo: 1 }}
                    source="foo"
                    elStyle={{ margin: 1 }}
                />
            ).html(),
            '<span style="margin:1px;">1</span>'
        ));

    it('should handle deep fields', () =>
        assert.equal(
            shallow(
                <NumberField record={{ foo: { bar: 2 } }} source="foo.bar" />
            ).html(),
            '<span>2</span>'
        ));
});
