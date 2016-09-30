import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import BooleanInput from './BooleanInput';

describe('<BooleanInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
    };

    it('should render as a toggle', () => {
        const wrapper = shallow(<BooleanInput {...defaultProps} />);
        const choices = wrapper.find('Toggle');
        assert.equal(choices.length, 1);
    });
});
