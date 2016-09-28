import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import UrlField from './UrlField';

describe('<UrlField />', () => {
    it('should display a link', () => {
        const record = { website: 'https://en.wikipedia.org/wiki/HAL_9000' };
        const wrapper = shallow(<UrlField record={record} source="website" type="url" />);
        assert.equal(wrapper.html(), '<a href="https://en.wikipedia.org/wiki/HAL_9000">https://en.wikipedia.org/wiki/HAL_9000</a>');
    });
});
