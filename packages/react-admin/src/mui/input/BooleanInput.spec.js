import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { BooleanInput } from './BooleanInput';

describe('<BooleanInput />', () => {
    test('should render as a mui Toggle', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />)
            .find('withStyles(FormControlLabel)')
            .shallow()
            .dive();
        const choices = wrapper.find('withStyles(Switch)');
        assert.equal(choices.length, 1);
    });

    test('should be checked if the value is true', () => {
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: true }} />
        )
            .find('withStyles(FormControlLabel)')
            .shallow()
            .dive();
        assert.equal(wrapper.find('withStyles(Switch)').prop('checked'), true);
    });

    test('should not be checked if the value is false', () => {
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: false }} />
        )
            .find('withStyles(FormControlLabel)')
            .shallow()
            .dive();
        assert.equal(wrapper.find('withStyles(Switch)').prop('checked'), false);
    });

    test('should not be checked if the value is undefined', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />)
            .find('withStyles(FormControlLabel)')
            .shallow()
            .dive();
        assert.equal(wrapper.find('withStyles(Switch)').prop('checked'), false);
    });
});
