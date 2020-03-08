import React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { renderWithRedux } from 'ra-core';

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
        const { queryAllByText } = renderWithRedux(
            <Show {...defaultShowProps} aside={<Aside />}>
                <div />
            </Show>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
