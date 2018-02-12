import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { DeleteButton } from './DeleteButton';
import { Link } from 'react-router-dom';

const translate = label => label;

describe('<DeleteButton />', () => {
    it('should render <FlatButton />', () => {
        const wrapper = shallow(<DeleteButton translate={translate} />);

        assert.equal(wrapper.type().muiName, 'FlatButton');
    });

    it('should be displayed as a <Link />', () => {
        const wrapper = shallow(<DeleteButton translate={translate} />);

        assert.equal(wrapper.prop('containerElement').type, Link);
    });

    it('should not be displayed as a <Link /> when disable', () => {
        const wrapper = shallow(
            <DeleteButton translate={translate} disabled />
        );

        assert.equal(wrapper.prop('containerElement').type, null);
        assert.equal(wrapper.prop('disabled'), true);
    });
});
