import * as React from 'react';
import expect from 'expect';
import { renderWithRedux } from 'ra-test';

import { Create } from './Create';

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
        const { queryAllByText } = renderWithRedux(
            <Create {...defaultCreateProps} aside={<Aside />}>
                <Dummy />
            </Create>
        );
        expect(queryAllByText('Hello')).toHaveLength(1);
    });
});
