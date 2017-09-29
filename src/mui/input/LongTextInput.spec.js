import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import LongTextInput from './LongTextInput';

describe('<LongTextInput />', () => {
    describe('error message', () => {
        it('should not be displayed if field is pristine', () => {
            const wrapper = shallow(
                <LongTextInput source="foo" meta={{ touched: false }} />
            );
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), false);
        });

        it('should not be displayed if field has been touched but is valid', () => {
            const wrapper = shallow(
                <LongTextInput
                    source="foo"
                    meta={{ touched: true, error: false }}
                />
            );
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), false);
        });

        it('should be displayed if field has been touched and is invalid', () => {
            const wrapper = shallow(
                <LongTextInput
                    source="foo"
                    meta={{ touched: true, error: 'Required field.' }}
                />
            );
            const TextFieldElement = wrapper.find('TextField');
            assert.equal(TextFieldElement.prop('errorText'), 'Required field.');
        });
    });
});
