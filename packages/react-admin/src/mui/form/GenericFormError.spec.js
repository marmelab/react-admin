import { shallow, mount } from 'enzyme';
import React from 'react';

import { GenericFormError } from './GenericFormError';

describe('<GenericFormError>', () => {
    it('should render a generic error when an error is supplied', () => {
        const wrapper = mount(<GenericFormError error="Error" />);
        expect(wrapper.text()).toBe('Error');
    });
    it("should not render when there's no error message ", () => {
        const wrapper = shallow(<GenericFormError />);
        expect(wrapper.type()).toBe(null);
    });
});
