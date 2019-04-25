import React from 'react';
import { render } from 'enzyme';
import { TestContext } from 'ra-core';

import Edit from './Edit';

describe('<Edit />', () => {
    const defaultEditProps = {
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
                <Edit {...defaultEditProps} aside={<Aside />}>
                    <div />
                </Edit>
            </TestContext>
        );
        const aside = wrapper.find('#aside');
        expect(aside.text()).toEqual('Hello');
    });
});
