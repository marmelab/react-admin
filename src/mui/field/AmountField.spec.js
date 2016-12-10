import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import AmountField from './AmountField';

describe('<AmountField />', () => {
    it('should return null when the record is not set', () => assert.equal(
        shallow(<AmountField source="foo" />).html(),
        null,
    ));

    it('should render an amount', () => assert.equal(
        shallow(<AmountField record={{ foo: 1 }} source="foo" />).html(),
        '<span>$1.00</span>',
    ));

    it('should render as many decimals as set in the decimals prop', () => assert.equal(
        shallow(<AmountField record={{ foo: 1 }} source="foo" decimals={0} />).html(),
        '<span>$1</span>',
    ));

    it('should render the currency symbol as set in the currency prop', () => assert.equal(
        shallow(<AmountField record={{ foo: 1 }} source="foo" currency="€" />).html(),
        '<span>€1.00</span>',
    ));

    it('should use custom styles passed as an elStyle prop', () => assert.equal(
        shallow(<AmountField record={{ foo: 1 }} source="foo" elStyle={{ margin: 1 }} />).html(),
        '<span style="margin:1px;">$1.00</span>',
    ));

    it('should handle deep fields', () => assert.equal(
        shallow(<AmountField record={{ foo: { bar: 2 } }} source="foo.bar" />).html(),
        '<span>$2.00</span>',
    ));
});
