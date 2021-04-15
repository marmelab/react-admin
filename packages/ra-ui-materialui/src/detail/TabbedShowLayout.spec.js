import * as React from 'react';
import expect from 'expect';
import { fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { TabbedShowLayout } from './TabbedShowLayout';
import { Tab } from './Tab';
import TextField from '../field/TextField';

describe('<TabbedShowLayout />', () => {
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

    it('should sync tabs with location by default', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        const { getAllByRole, queryByText } = renderWithRouter(
            <Router history={history}>
                <TabbedShowLayout
                    basePath="/"
                    record={{ id: 123 }}
                    resource="foo"
                >
                    {null}
                    <Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </Tab>
                    <Tab label="Tab2">
                        <TextField label="Field On Tab2" source="field2" />
                    </Tab>
                </TabbedShowLayout>
            </Router>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(history.location.pathname).toEqual('/1');
        expect(queryByText('Field On Tab2')).not.toBeNull();
        expect(queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(tabs[0]);
        expect(history.location.pathname).toEqual('/');
        expect(queryByText('Field On Tab1')).not.toBeNull();
        expect(queryByText('Field On Tab2')).toBeNull();
    });

    it('should not sync tabs with location if syncWithLocation is false', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        const { getAllByRole, queryByText } = renderWithRouter(
            <Router history={history}>
                <TabbedShowLayout
                    basePath="/"
                    record={{ id: 123 }}
                    resource="foo"
                    syncWithLocation={false}
                >
                    {null}
                    <Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </Tab>
                    <Tab label="Tab2">
                        <TextField label="Field On Tab2" source="field2" />
                    </Tab>
                </TabbedShowLayout>
            </Router>
        );

        const tabs = getAllByRole('tab');
        fireEvent.click(tabs[1]);
        expect(history.location.pathname).toEqual('/');
        expect(queryByText('Field On Tab2')).not.toBeNull();
        expect(queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(tabs[0]);
        expect(history.location.pathname).toEqual('/');
        expect(queryByText('Field On Tab1')).not.toBeNull();
        expect(queryByText('Field On Tab2')).toBeNull();
    });
});
