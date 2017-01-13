import React from 'react';
import assert from 'assert';
import { shallow, render } from 'enzyme';
import sinon from 'sinon';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import NumberInput from './NumberInput';

const muiTheme = getMuiTheme({
    userAgent: false,
});

describe('<NumberInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
    };

    it('should use a mui TextField', () => {
        const wrapper = shallow(<NumberInput {...defaultProps} label="hello" />);
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('floatingLabelText'), 'hello');
    });

    it('should render an input of type number by default', () => {
        const wrapper = render(<MuiThemeProvider muiTheme={muiTheme}>
            <NumberInput {...defaultProps} input={{ id: 'foo' }} />
        </MuiThemeProvider>);

        const inputs = wrapper.find('input');
        assert.equal(inputs.length, 1);

        const input = inputs.first();
        assert.equal(input.attr('type'), 'number');
        assert.equal(input.attr('step'), 'any');
    });

    it('should use the input parameter value as the initial input value', () => {
        const wrapper = render(<MuiThemeProvider muiTheme={muiTheme}>
            <NumberInput {...defaultProps} input={{ value: 2 }} />
        </MuiThemeProvider>);

        const input = wrapper.find('input').first();
        assert.equal(input.attr('value'), 2);
    });

    it('should call props `input.onChange` method when changed', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(<NumberInput {...defaultProps} input={{ value: 2, onChange }} />);
        wrapper.find('TextField').simulate('change', null, 3);
        assert.deepEqual(onChange.args, [[null, '3']]);
    });

    it('should return a numeric value', () => {
        const onChange = sinon.spy();
        const wrapper = shallow(<NumberInput {...defaultProps} input={{ value: '2', onChange }} />);
        const TextFieldElement = wrapper.find('TextField').first();
        TextFieldElement.simulate('blur');
        assert.deepEqual(onChange.args, [[2]]);
    });
});
