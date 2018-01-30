import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import FormTab from './FormTab';
import FormInput from './FormInput';

describe('<FormTab />', () => {
    it('filter falsy children', () => {
        const condition = false;

        const wrapper = shallow(
            <FormTab>
                <span source="foo" />
                {condition && <span />}
                {condition ? <span /> : null}
            </FormTab>
        );

        assert.equal(wrapper.find(FormInput).length, 1);
    });
});
