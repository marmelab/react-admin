import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import BooleanField from './BooleanField';

describe('<BooleanField />', () => {
    it('should display tick if value is true', () => {
        const record = { published: true };
        const wrapper = shallow(<BooleanField record={record} source="published" />);
        assert.equal(wrapper.find('ActionDone').length, 1);
    });

    it('should display cross if value is false', () => {
        const record = { published: false };
        const wrapper = shallow(<BooleanField record={record} source="published" />);
        assert.equal(wrapper.find('ContentClear').length, 1);
    });

    it('should not display anything if value is null', () => {
        const record = { published: null };
        const wrapper = shallow(<BooleanField record={record} source="published" />);
        assert.equal(wrapper.find('span').length, 1);
    });
});
