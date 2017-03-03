import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import NumberInput from './NumberInput';

describe('<NumberInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
    };

    it('should use a mui TextField', () => {
        const wrapper = shallow(<NumberInput {...defaultProps} input={{ value: 'hello' }} />);
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('value'), 'hello');
        assert.equal(TextFieldElement.prop('type'), 'number');
    });

    it('should call props `input.onChange` method when changed', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(<NumberInput {...defaultProps} input={{ value: 2, onChange }} />);
        wrapper.find('TextField').simulate('change', null, 3);
        assert.deepEqual(onChange.args, [[null, '3']]);
    });

    it('should return a numeric value', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(
            <NumberInput
                {...defaultProps}
                input={{
                    value: '2',
                    onBlur: () => {},
                    onChange,
                }}
            />,
        );

        const TextFieldElement = wrapper.find('TextField').first();
        TextFieldElement.simulate('blur');
        assert.deepEqual(onChange.args, [[2]]);
    });

    it('should call redux-form onBlur handler when blurred', () => {
        const onBlur = sinon.spy();
        const wrapper = shallow(
            <NumberInput
                {...defaultProps}
                input={{
                    value: '2',
                    onBlur,
                    onChange: () => {},
                }}
            />,
        );

        const TextFieldElement = wrapper.find('TextField').first();
        TextFieldElement.simulate('blur', 'event');
        assert.deepEqual(onBlur.args[0], ['event']);
    });
});
