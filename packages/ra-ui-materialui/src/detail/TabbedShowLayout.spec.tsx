import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { CoreAdminContext, testDataProvider } from 'ra-core';

import { TabbedShowLayout } from './TabbedShowLayout';
import { TextField } from '../field';

describe('<TabbedShowLayout />', () => {
    it('should display the first Tab component and its content', () => {
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <TabbedShowLayout record={{ id: 123 }}>
                    <TabbedShowLayout.Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="Tab2">
                        <TextField label="Field On Tab2" source="field2" />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </CoreAdminContext>
        );

        expect(screen.queryByText('Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    });

    it('should display the first valid Tab component and its content', () => {
        const history = createMemoryHistory();
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <TabbedShowLayout record={{ id: 123 }}>
                    {null}
                    <TabbedShowLayout.Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="Tab2">
                        <TextField label="Field On Tab2" source="field2" />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </CoreAdminContext>
        );

        expect(screen.queryByText('Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    });

    it('should sync tabs with location by default', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <TabbedShowLayout record={{ id: 123 }}>
                    {null}
                    <TabbedShowLayout.Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="Tab2">
                        <TextField label="Field On Tab2" source="field2" />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Tab2'));
        expect(history.location.pathname).toEqual('/1');
        expect(screen.queryByText('Field On Tab2')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(screen.getByText('Tab1'));
        expect(history.location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab2')).toBeNull();
    });

    it('should sync tabs with location by default when using custom tab paths', () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });

        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <TabbedShowLayout record={{ id: 123 }}>
                    {null}
                    <TabbedShowLayout.Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="Tab2" path="second">
                        <TextField label="Field On Tab2" source="field2" />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Tab2'));
        expect(history.location.pathname).toEqual('/second');
        expect(screen.queryByText('Field On Tab2')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(screen.getByText('Tab1'));
        expect(history.location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab2')).toBeNull();
    });

    it('should not sync tabs with location if syncWithLocation is false', async () => {
        const history = createMemoryHistory({ initialEntries: ['/'] });
        const record = { id: 123 };
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={history}
            >
                <TabbedShowLayout record={record} syncWithLocation={false}>
                    {null}
                    <TabbedShowLayout.Tab label="Tab1">
                        <TextField label="Field On Tab1" source="field1" />
                    </TabbedShowLayout.Tab>
                    <TabbedShowLayout.Tab label="Tab2">
                        <TextField label="Field On Tab2" source="field2" />
                    </TabbedShowLayout.Tab>
                </TabbedShowLayout>
            </CoreAdminContext>
        );

        fireEvent.click(screen.getByText('Tab2'));
        expect(history.location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab2')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(screen.getByText('Tab1'));
        expect(history.location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab2')).toBeNull();
    });
});
