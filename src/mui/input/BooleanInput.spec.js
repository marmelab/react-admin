import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';

import BooleanInput from './BooleanInput';

describe('<BooleanInput />', () => {
    it('should render as a mui Toggle', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />);
        const choices = wrapper.find('Toggle');
        assert.equal(choices.length, 1);
    });

    it('should be checked if the value is true', () => {
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: true }} />
        );
        assert.equal(wrapper.find('Toggle').prop('defaultToggled'), true);
    });

    it('should not be checked if the value is false', () => {
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: false }} />
        );
        assert.equal(wrapper.find('Toggle').prop('defaultToggled'), false);
    });

    it('should not be checked if the value is undefined', () => {
        const wrapper = shallow(<BooleanInput source="foo" input={{}} />);
        assert.equal(wrapper.find('Toggle').prop('defaultToggled'), false);
    });

    it('should trigger input.onChange with true after being checked', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: false, onChange }} />
        );

        wrapper.find('Toggle').simulate('toggle', {}, true);

        return new Promise(resolve => {
            setTimeout(() => {
                assert(onChange.calledWith(true));
                resolve();
            }, 100);
        });
    });

    it('should trigger input.onChange with false after being checked', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(
            <BooleanInput source="foo" input={{ value: true, onChange }} />
        );

        wrapper.find('Toggle').simulate('toggle', {}, false);

        return new Promise(resolve => {
            setTimeout(() => {
                assert(onChange.calledWith(false));
                resolve();
            }, 100);
        });
    });
});
