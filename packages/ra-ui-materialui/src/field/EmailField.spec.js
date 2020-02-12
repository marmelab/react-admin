import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import { EmailField } from './EmailField';

describe('<EmailField />', () => {
    it('should render as an email link', () => {
        const record = { foo: 'foo@bar.com' };
        const wrapper = shallow(<EmailField record={record} source="foo" />);
        assert.equal(
            wrapper.html(),
            '<a href="mailto:foo@bar.com">foo@bar.com</a>'
        );
    });

    it('should handle deep fields', () => {
        const record = { foo: { bar: 'foo@bar.com' } };
        const wrapper = shallow(
            <EmailField record={record} source="foo.bar" />
        );
        assert.equal(
            wrapper.html(),
            '<a href="mailto:foo@bar.com">foo@bar.com</a>'
        );
    });

    it('should display an email (mailto) link', () => {
        const record = { email: 'hal@kubrickcorp.com' };
        const wrapper = shallow(<EmailField record={record} source="email" />);
        assert.equal(
            wrapper.html(),
            '<a href="mailto:hal@kubrickcorp.com">hal@kubrickcorp.com</a>'
        );
    });

    it('should use custom className', () =>
        assert.deepEqual(
            shallow(
                <EmailField
                    record={{ email: true }}
                    source="email"
                    className="foo"
                />
            ).prop('className'),
            'foo'
        ));

    it('should render the emptyText when value is null', () => {
        const wrapper = shallow(
            <EmailField record={{ foo: null }} source="foo" emptyText="NA" />
        );
        assert.equal(wrapper.html(), '<span>NA</span>');
    });

    it('should return null when the record has no value for the source', () =>
        assert.equal(
            shallow(<EmailField record={{}} source="foo" />).html(),
            null
        ));
});
