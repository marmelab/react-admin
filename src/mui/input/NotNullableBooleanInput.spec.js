import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import NotNullableBooleanInput from './NotNullableBooleanInput';

describe('<NotNullableBooleanInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
    };

    it('should render as a toggle', () => {
        const wrapper = shallow(<NotNullableBooleanInput {...defaultProps} />);
        const choices = wrapper.find('Toggle');
        assert.equal(choices.length, 1);
    });
});
