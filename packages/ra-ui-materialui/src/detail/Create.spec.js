import React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { renderWithRedux } from 'ra-core';

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
        const { queryAllByText } = renderWithRedux(
            <Create {...defaultCreateProps} aside={<Aside />}>
                <Dummy />
            </Create>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
