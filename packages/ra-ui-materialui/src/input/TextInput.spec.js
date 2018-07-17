import { shallow } from 'enzyme';
import assert from 'assert';
import React from 'react';

import { TextInput } from './TextInput';

describe('<TextInput />', () => {
    const defaultProps = {
        source: 'foo',
        meta: {},
        input: {},
    };

    it('should use a mui TextField when type is text', () => {
        const wrapper = shallow(
            <TextInput {...defaultProps} input={{ value: 'hello' }} />
        );
        const TextFieldElement = wrapper.find(
            'TranslatedComponent(WithStyles(TextField))'
        );
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('value'), 'hello');
        assert.equal(TextFieldElement.prop('type'), 'text');
    });

    it('should use a mui TextField when type is password', () => {
        const wrapper = shallow(
            <TextInput {...defaultProps} type="password" />
        );
        const TextFieldElement = wrapper.find(
            'TranslatedComponent(WithStyles(TextField))'
        );
        assert.equal(TextFieldElement.length, 1);
        assert.equal(TextFieldElement.prop('type'), 'password');
    });

    it('should call redux-form onBlur handler when blurred', () => {
        const onBlur = jest.fn();
        const wrapper = shallow(
            <TextInput {...defaultProps} input={{ onBlur }} />
        );

        const TextFieldElement = wrapper
            .find('TranslatedComponent(WithStyles(TextField))')
            .first();
        TextFieldElement.simulate('blur', 'event');
        assert.equal(onBlur.mock.calls[0][0], 'event');
    });

    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <TextInput {...defaultProps} meta={{ touched: false }} />
            );
            const TextFieldElement = wrapper.find(
                'TranslatedComponent(WithStyles(TextField))'
            );
            assert.equal(TextFieldElement.prop('helperText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <TextInput
                    {...defaultProps}
                    meta={{ touched: true, error: false }}
                />
            );
            const TextFieldElement = wrapper.find(
                'TranslatedComponent(WithStyles(TextField))'
            );
            assert.equal(TextFieldElement.prop('helperText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <TextInput
                    {...defaultProps}
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const TextFieldElement = wrapper.find(
                'TranslatedComponent(WithStyles(TextField))'
            );
            assert.equal(
                TextFieldElement.prop('helperText'),
                'Required field.'
            );
        });
    });
});
