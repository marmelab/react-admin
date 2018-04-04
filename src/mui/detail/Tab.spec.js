import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';

import Tab from './Tab';

describe('<Tab />', () => {
    it('filter falsy children', () => {
        const condition = false;

        const wrapper = shallow(
            <Tab>
                <span source="foo" />
                {condition && <span source="foo1" />}
                {condition ? <span source="foo2" /> : null}
            </Tab>
        );

        assert.equal(wrapper.find('span[source]').length, 1);
    });
});
