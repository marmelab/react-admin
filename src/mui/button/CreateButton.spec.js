import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { CreateButton } from './CreateButton';
import { Link } from 'react-router-dom';

const translate = label => label;

describe('<CreateButton />', () => {
    it('should render <FlatButton />', () => {
        const wrapper = shallow(<CreateButton translate={translate} />);

        assert.equal(wrapper.type().muiName, 'FlatButton');
    });

    it('should be displayed as a <Link />', () => {
        const wrapper = shallow(<CreateButton translate={translate} />);

        assert.equal(wrapper.prop('containerElement').type, Link);
    });

    it('should not be displayed as a <Link /> when disable', () => {
        const wrapper = shallow(
            <CreateButton translate={translate} disabled />
        );

        assert.equal(wrapper.prop('containerElement').type, null);
        assert.equal(wrapper.prop('disabled'), true);
    });
});
