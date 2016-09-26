import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import TextField from './TextField';

describe.only('<TextField />', () => {
    it('should display record specific value as plain text by default', () => {
        const record = { title: "I'm sorry, Dave. I'm afraid I can't do that." };
        const wrapper = shallow(<TextField record={record} source="title" />);
        assert.equal(wrapper.html(), '<span>I&#x27;m sorry, Dave. I&#x27;m afraid I can&#x27;t do that.</span>');
    });

    it('should display an email link if type is `email`', () => {
        const record = { email: 'hal@kubrickcorp.com' };
        const wrapper = shallow(<TextField record={record} source="email" type="email" />);
        assert.equal(wrapper.html(), '<a href="mailto:hal@kubrickcorp.com">hal@kubrickcorp.com</a>');
    });

    it('should display a link if type is `url`', () => {
        const record = { website: 'https://en.wikipedia.org/wiki/HAL_9000' };
        const wrapper = shallow(<TextField record={record} source="website" type="url" />);
        assert.equal(wrapper.html(), '<a href="https://en.wikipedia.org/wiki/HAL_9000">https://en.wikipedia.org/wiki/HAL_9000</a>');
    });

    it('should display some bullets if type is `password`', () => {
        const record = { password: 'Heuristically' };
        const wrapper = shallow(<TextField record={record} source="password" type="password" />);
        assert.equal(wrapper.html(), '<span>•••••••••</span>');
    });
});
