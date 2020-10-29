import * as React from 'react';
import expect from 'expect';
import { cleanup } from '@testing-library/react';
import { renderWithRedux } from 'ra-core';

import { Create } from './Create';

describe('<Create />', () => {
    afterEach(cleanup);

    const initialState = {
        admin: {
            resources: {
                posts: { props: { name: 'posts' } },
            },
        },
    };

    const defaultCreateProps = {
        basePath: '/posts',
        id: '123',
        resource: 'posts',
        location: {},
        match: {},
    };

    it('should display aside component', () => {
        const Dummy = () => <div />;
        const Aside = () => <div id="aside">Hello</div>;
        const { queryAllByText } = renderWithRedux(
            <Create {...defaultCreateProps} aside={<Aside />}>
                <Dummy />
            </Create>,
            initialState
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
