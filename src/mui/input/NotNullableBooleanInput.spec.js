import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import NotNullableBoolean from './NotNullableBoolean';

describe('<NotNullableBoolean />', () => {
    const defaultProps = {
        input: {},
        meta: {},
    };

    it('should render as a toggle', () => {
        const wrapper = shallow(<NotNullableBoolean {...defaultProps} />);
        const choices = wrapper.find('Toggle');
        assert.equal(choices.length, 1);
    });
});
