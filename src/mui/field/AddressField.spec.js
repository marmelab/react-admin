import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import AddressField from './AddressField';

describe('<AddressField />', () => {
    it('should render an address link with the iPhone URL scheme', () => {
        global.navigator = {
            userAgent: 'iPhone',
        };
        const record = {
            address: '5 Avenue Anatole France, 75007 Paris',
        };
        const wrapper = shallow(
            <AddressField record={record} source="address" />
        );
        assert.equal(
            wrapper.html(),
            '<a href="http://maps.apple.com/?q=5 Avenue Anatole France, 75007 Paris"><span>5 Avenue Anatole France, 75007 Paris</span></a>'
        );
    });
    it('should render an address link with the Geo URI scheme for Android users', () => {
        global.navigator = {
            userAgent: 'Android',
        };
        const record = {
            address: '5 Avenue Anatole France, 75007 Paris',
        };
        const wrapper = shallow(
            <AddressField record={record} source="address" />
        );
        assert.equal(
            wrapper.html(),
            '<a href="geo:?q=5 Avenue Anatole France, 75007 Paris"><span>5 Avenue Anatole France, 75007 Paris</span></a>'
        );
    });
    it('should render Google maps link for desktop users', () => {
        global.navigator = {
            userAgent: 'Linux',
        };
        const record = {
            address: '5 Avenue Anatole France, 75007 Paris',
        };
        const wrapper = shallow(
            <AddressField record={record} source="address" />
        );
        assert.equal(
            wrapper.html(),
            '<a target="_blank" href="https://www.google.com/maps/search/?api=1&amp;query=5 Avenue Anatole France, 75007 Paris"><span>5 Avenue Anatole France, 75007 Paris</span></a>'
        );
    });
});
