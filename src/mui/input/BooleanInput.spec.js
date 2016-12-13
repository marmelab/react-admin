import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import BooleanInput from './BooleanInput';

describe('<BooleanInput />', () => {

    it('should render as a mui Toggle', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}}/>);
        const choices = wrapper.find('Toggle');
        assert.equal(choices.length, 1);
    });

    it('should be checked if the value is true', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{ value: true }} />);
        assert.equal(wrapper.find('Toggle').prop('defaultToggled'), true);
    });

    it('should not be checked if the value is false', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{ value: false }} />);
        assert.equal(wrapper.find('Toggle').prop('defaultToggled'), false);
    });

    it('should not be checked if the value is undefined', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />);
        assert.equal(wrapper.find('Toggle').prop('defaultToggled'), false);
    });

});
