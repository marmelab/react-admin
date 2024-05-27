import * as React from 'react';
import expect from 'expect';
import { fireEvent, render, screen } from '@testing-library/react';
import { CoreAdminContext, testDataProvider, TestMemoryRouter } from 'ra-core';

import { TabbedShowLayout } from './TabbedShowLayout';
import { TextField } from '../field';

describe('<TabbedShowLayout />', () => {
    it('should display the first Tab component and its content', () => {
        render(
            <TestMemoryRouter>
                <CoreAdminContext dataProvider={testDataProvider()}>
                    <TabbedShowLayout record={{ id: 123 }}>
                        <TabbedShowLayout.Tab label="Tab1">
                            <TextField label="Field On Tab1" source="field1" />
                        </TabbedShowLayout.Tab>
                        <TabbedShowLayout.Tab label="Tab2">
                            <TextField label="Field On Tab2" source="field2" />
                        </TabbedShowLayout.Tab>
                    </TabbedShowLayout>
                </CoreAdminContext>
            </TestMemoryRouter>
        );

        expect(screen.queryByText('Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    });

    it('should display the first valid Tab component and its content', () => {
        render(
            <TestMemoryRouter>
                <CoreAdminContext dataProvider={testDataProvider()}>
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
            </TestMemoryRouter>
        );

        expect(screen.queryByText('Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
    });

    it('should sync tabs with location by default', () => {
        let location: any;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <CoreAdminContext dataProvider={testDataProvider()}>
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
            </TestMemoryRouter>
        );

        fireEvent.click(screen.getByText('Tab2'));
        expect(location.pathname).toEqual('/1');
        expect(screen.queryByText('Field On Tab2')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(screen.getByText('Tab1'));
        expect(location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab2')).toBeNull();
    });

    it('should sync tabs with location by default when using custom tab paths', () => {
        let location: any;
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <CoreAdminContext dataProvider={testDataProvider()}>
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
            </TestMemoryRouter>
        );

        fireEvent.click(screen.getByText('Tab2'));
        expect(location.pathname).toEqual('/second');
        expect(screen.queryByText('Field On Tab2')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(screen.getByText('Tab1'));
        expect(location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab2')).toBeNull();
    });

    it('should not sync tabs with location if syncWithLocation is false', async () => {
        let location: any;
        const record = { id: 123 };
        render(
            <TestMemoryRouter
                initialEntries={['/']}
                locationCallback={l => {
                    location = l;
                }}
            >
                <CoreAdminContext dataProvider={testDataProvider()}>
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
            </TestMemoryRouter>
        );

        fireEvent.click(screen.getByText('Tab2'));
        expect(location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab2')).not.toBeNull();
        expect(screen.queryByText('Field On Tab1')).toBeNull();
        fireEvent.click(screen.getByText('Tab1'));
        expect(location.pathname).toEqual('/');
        expect(screen.queryByText('Field On Tab1')).not.toBeNull();
        expect(screen.queryByText('Field On Tab2')).toBeNull();
    });
});
