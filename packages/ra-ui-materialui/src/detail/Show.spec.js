import React from 'react';
import expect from 'expect';
import { render, cleanup } from 'react-testing-library';
import { TestContext } from 'ra-core';

import Show from './Show';

describe('<Show />', () => {
    afterEach(cleanup);

    const defaultShowProps = {
        basePath: '/',
        id: '123',
        resource: 'foo',
        location: {},
        match: {},
    };

    it('should display aside component', () => {
        const Aside = () => <div id="aside">Hello</div>;
        const { queryAllByText } = render(
            <TestContext>
                <Show {...defaultShowProps} aside={<Aside />}>
                    <div />
                </Show>
            </TestContext>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
