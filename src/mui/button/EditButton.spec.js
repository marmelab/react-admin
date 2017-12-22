import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { EditButton } from './EditButton';
import { Link } from 'react-router-dom';

const translate = label => label;

describe('<EditButton />', () => {
    it('should render <FlatButton />', () => {
        const wrapper = shallow(<EditButton translate={translate} />);

        assert.equal(wrapper.type().muiName, 'FlatButton');
    });

    it('should be displayed as a <Link />', () => {
        const wrapper = shallow(<EditButton translate={translate} />);

        assert.equal(wrapper.prop('containerElement').type, Link);
    });

    it('should not be displayed as a <Link /> when disable', () => {
        const wrapper = shallow(<EditButton translate={translate} disabled />);

        assert.equal(wrapper.prop('containerElement').type, null);
        assert.equal(wrapper.prop('disabled'), true);
    });
});
