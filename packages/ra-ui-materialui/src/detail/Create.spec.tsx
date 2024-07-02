import * as React from 'react';
import expect from 'expect';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { screen, render } from '@testing-library/react';

import { Create } from './Create';
import { Basic, Title, TitleFalse, TitleElement } from './Create.stories';

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

    describe('title', () => {
        it('should display by default the title of the resource', async () => {
            render(<Basic />);
            await screen.findByText('Create content');
            screen.getByText('Create Book');
        });

        it('should render custom title string when defined', async () => {
            render(<Title />);
            await screen.findByText('Create content');
            screen.getByText('Hello');
            expect(screen.queryByText('Create Book')).toBeNull();
        });

        it('should render custom title element when defined', async () => {
            render(<TitleElement />);
            await screen.findByText('Create content');
            screen.getByText('Hello');
            expect(screen.queryByText('Create Book')).toBeNull();
        });

        it('should not render default title when false', async () => {
            render(<TitleFalse />);
            await screen.findByText('Create content');
            expect(screen.queryByText('Create Book')).toBeNull();
        });
    });
});
