import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    it('should render as a mui Toggle', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />)
            .find('WithStyles(FormControlLabel)')
            .shallow()
            .dive();
        const choices = wrapper.find('WithStyles(Switch)');
        assert.equal(choices.length, 1);
    });

    it('should be checked if the value is true', () => {
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: true }} />
        )
            .find('WithStyles(FormControlLabel)')
            .shallow()
            .dive();
        assert.equal(wrapper.find('WithStyles(Switch)').prop('checked'), true);
    });

    it('should not be checked if the value is false', () => {
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: false }} />
        )
            .find('WithStyles(FormControlLabel)')
            .shallow()
            .dive();
        assert.equal(wrapper.find('WithStyles(Switch)').prop('checked'), false);
    });

    it('should not be checked if the value is undefined', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />)
            .find('WithStyles(FormControlLabel)')
            .shallow()
            .dive();
        assert.equal(wrapper.find('WithStyles(Switch)').prop('checked'), false);
    });
});
