import * as React from 'react';
import expect from 'expect';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { screen, render } from '@testing-library/react';

import { Create } from './Create';

describe('<Create />', () => {
    const defaultCreateProps = {
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

    it('should accept more than one child', () => {
        const Form = () => <div>form</div>;
        const HelpText = () => <div>help</div>;
        render(
            <CoreAdminContext dataProvider={testDataProvider()}>
                <Create {...defaultCreateProps}>
                    <Form />
                    <HelpText />
                </Create>
            </CoreAdminContext>
        );
        expect(screen.queryAllByText('form')).toHaveLength(1);
        expect(screen.queryAllByText('help')).toHaveLength(1);
    });
});
