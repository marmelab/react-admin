import React from 'react';
import { render } from 'enzyme';
import { TestContext } from 'ra-core';

import Create from './Create';

describe('<Create />', () => {
    const defaultCreateProps = {
        basePath: '/foo',
        id: '123',
        resource: 'foo',
        location: {},
        match: {},
    };

    it('should display aside component', () => {
        const Dummy = () => <div />;
        const Aside = () => <div id="aside">Hello</div>;
        const wrapper = render(
            <TestContext>
                <Create {...defaultCreateProps} aside={<Aside />}>
                    <Dummy />
                </Create>
            </TestContext>
        );
        const aside = wrapper.find('#aside');
        expect(aside.text()).toEqual('Hello');
    });
});
