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
        const wrapper = shallow(<TextInput label='hello' />);
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('floatingLabelText'), 'hello');
    });

    it('should render an input of type text', () => {
        const wrapper = render(<MuiThemeProvider muiTheme={muiTheme}>
            <TextInput input={{ id: 'foo' }} />
        </MuiThemeProvider>);

        const inputs = wrapper.find('input');
        assert.equal(inputs.length, 1);

        const input = inputs.first();
        assert.equal(input.attr('type'), 'text');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(<TextInput meta={{ touched: false }} />);
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(<TextInput meta={{ touched: true, error: false }} />);
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(<TextInput meta={{ touched: true, error: 'Required field.' }} />);
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), 'Required field.');
        });
    });
});
