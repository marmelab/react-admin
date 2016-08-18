import React from 'react';
import assert from 'assert';
import { shallow, render } from 'enzyme';
import TextInput from './TextInput';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const muiTheme = getMuiTheme({
    userAgent: false,
});

describe('<TextInput />', () => {
    it('should use a mui TextField', () => {
        const wrapper = shallow(<TextInput label="hello" record={{ foo: 'bar' }} source="foo" />);
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('name'), 'foo');
        assert.equal(TextFieldElement.prop('value'), 'bar');
        assert.equal(TextFieldElement.prop('floatingLabelText'), 'hello');
    });

    it('should render an input of type text', () => {
        const wrapper = render(<MuiThemeProvider muiTheme={muiTheme}>
            <TextInput record={{ foo: 'bar' }} source="foo" />
        </MuiThemeProvider>);
        const inputs = wrapper.find('input');
        assert.equal(inputs.length, 1);
        const input = inputs.first();
        assert.equal(input.attr('type'), 'text');
        assert.equal(input.attr('value'), 'bar');
    });
});
