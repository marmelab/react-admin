import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import EmailField from './EmailField';

describe('<EmailField />', () => {
    it('should display an email (mailto) link', () => {
        const record = { email: 'hal@kubrickcorp.com' };
        const wrapper = shallow(<EmailField record={record} source="email" type="email" />);
        assert.equal(wrapper.html(), '<a href="mailto:hal@kubrickcorp.com">hal@kubrickcorp.com</a>');
    });
});
