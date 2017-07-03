import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { EmbeddedArrayInput } from './EmbeddedArrayInput';

describe('<EmbeddedArrayInput />', () => {
    const defaultProps = {
        source: 'sub_items',
    };

    it('should contain 2 divs', () => {
        const wrapper = shallow(
            <EmbeddedArrayInput {...defaultProps} input={{ value: [{}, {}] }} />,
        );
        const fieldArrayElement = wrapper.find('FieldArray');
        assert.equal(fieldArrayElement.prop('name'), 'sub_items');
    });
});
