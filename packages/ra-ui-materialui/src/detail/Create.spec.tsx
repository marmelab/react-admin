import * as React from 'react';
import expect from 'expect';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { screen, render } from '@testing-library/react';

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
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Create {...defaultCreateProps} aside={<Aside />}>
                    <Dummy />
                </Create>
            </CoreAdminContext>
        );
        expect(screen.queryAllByText('Hello')).toHaveLength(1);
    });
});
