import assert from 'assert';
import { shallow } from 'enzyme';
import React from 'react';

import { NullableBooleanInput } from './NullableBooleanInput';

describe('<NullableBooleanInput />', () => {
    const defaultProps = {
        input: {},
        meta: {},
        translate: x => x,
    };

    it('should give three different choices for true, false or unknown', () => {
        const wrapper = shallow(
            <NullableBooleanInput source="foo" {...defaultProps} />
        );
        const choices = wrapper.find('Connect(FormField)').prop('choices');
        assert.deepEqual(choices, [
            { id: null, name: '' },
            { id: false, name: 'aor.boolean.false' },
            { id: true, name: 'aor.boolean.true' },
        ]);
    });
});
