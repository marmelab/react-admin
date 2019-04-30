import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import { TestContext } from 'ra-core';

import Create from './Create';

describe('<Create />', () => {
    afterEach(cleanup);

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
        const { queryAllByText } = render(
            <TestContext>
                <Create {...defaultCreateProps} aside={<Aside />}>
                    <Dummy />
                </Create>
            </TestContext>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
