import * as React from 'react';
import expect from 'expect';
import { cleanup, render } from '@testing-library/react';

import TabbedShowLayout from './TabbedShowLayout';
import Tab from './Tab';
import TextField from '../field/TextField';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

describe('<TabbedShowLayout />', () => {
    afterEach(cleanup);

    const renderWithRouter = children => {
        const history = createMemoryHistory();

        return {
            history,
            ...render(<Router history={history}>{children}</Router>),
        };
    };

    it('should display the first Tab component and its content', () => {
        const { queryByText } = renderWithRouter(
            <TabbedShowLayout basePath="/" record={{ id: 123 }} resource="foo">
                <Tab label="Tab1">
                    <TextField label="Field On Tab1" source="field1" />
                </Tab>
                <Tab label="Tab2">
                    <TextField label="Field On Tab2" source="field2" />
                </Tab>
            </TabbedShowLayout>
        );

        expect(queryByText('Tab1')).not.toBeNull();
        expect(queryByText('Field On Tab1')).not.toBeNull();
    });

    it('should display the first valid Tab component and its content', () => {
        const { queryByText } = renderWithRouter(
            <TabbedShowLayout basePath="/" record={{ id: 123 }} resource="foo">
                {null}
                <Tab label="Tab1">
                    <TextField label="Field On Tab1" source="field1" />
                </Tab>
                <Tab label="Tab2">
                    <TextField label="Field On Tab2" source="field2" />
                </Tab>
            </TabbedShowLayout>
        );

        expect(queryByText('Tab1')).not.toBeNull();
        expect(queryByText('Field On Tab1')).not.toBeNull();
    });
});
