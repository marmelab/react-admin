import expect from 'expect';
import { shallow } from 'enzyme';
import React from 'react';

import { CloneButton } from './CloneButton';

describe('<CloneButton />', () => {
    it('should pass a clone of the record in the location state', () => {
        const wrapper = shallow(
            <CloneButton record={{ id: 123, foo: 'bar' }} basePath="" />
        );

        expect(wrapper.prop('to')).toEqual(
            expect.objectContaining({
                search: 'source=%7B%22foo%22%3A%22bar%22%7D',
            })
        );
    });
});
