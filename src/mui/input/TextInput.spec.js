import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import TextInput from './TextInput';

describe('<TextInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
    };

    it('should use a mui TextField', () => {
        const wrapper = shallow(<TextInput {...defaultProps} input={{ value: 'hello' }} />);
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('value'), 'hello');
        assert.equal(TextFieldElement.prop('type'), 'text');
    });


    it('should use a mui TextField', () => {
        const wrapper = shallow(<TextInput {...defaultProps} type="password" />);
        const TextFieldElement = wrapper.find('TextField');
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('type'), 'password');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(<TextInput {...defaultProps} meta={{ touched: false }} />);
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(<TextInput {...defaultProps} meta={{ touched: true, error: false }} />);
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(<TextInput {...defaultProps} meta={{ touched: true, error: 'Required field.' }} />);
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), 'Required field.');
        });
    });
});
