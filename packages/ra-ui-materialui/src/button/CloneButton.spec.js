import { shallow } from 'enzyme';
import React from 'react';

import { CloneButton } from './CloneButton';

describe('<CloneButton />', () => {
    it('should pass a clone of the record in the location state', () => {
        const wrapper = shallow(
            <CloneButton record={{ id: 123, foo: 'bar' }} />
        );

        expect(wrapper.prop('to')).toEqual(
            expect.objectContaining({ state: { record: { foo: 'bar' } } })
        );
    });
});
