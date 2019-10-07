import React from 'react';
import { render } from 'enzyme';
import { TestContext } from 'ra-core';

import Show from './Show';

describe('<Show />', () => {
    const defaultShowProps = {
        basePath: '/',
        id: '123',
        resource: 'foo',
        location: {},
        match: {},
    };

    it('should display aside component', () => {
        const Aside = () => <div id="aside">Hello</div>;
        const wrapper = render(
            <TestContext>
                <Show {...defaultShowProps} aside={<Aside />}>
                    <div />
                </Show>
            </TestContext>
        );
        const aside = wrapper.find('#aside');
        expect(aside.text()).toEqual('Hello');
    });
});
