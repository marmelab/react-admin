import * as React from 'react';
import { Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';

import CoreAdminContext from './CoreAdminContext';
import { CustomRoutes } from './CustomRoutes';
import { RoutesWithLayout } from './RoutesWithLayout';
import { testDataProvider } from '../dataProvider';

describe('<RoutesWithLayout>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const Custom = () => <div>Custom</div>;
    const Resource = ({ name }) => <div>{name}</div>;
    const CatchAll = () => <div>Catch all</div>;

    it('should show dashboard on / when provided', () => {
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory({ initialEntries: ['/'] })}
            >
                <RoutesWithLayout
                    catchAll={CatchAll}
                    dashboard={Dashboard}
                    firstResource="default"
                >
                    <Resource name="default" />
                    <Resource name="another" />
                    <Resource name="yetanother" />
                </RoutesWithLayout>
            </CoreAdminContext>
        );

        expect(screen.queryByText('Dashboard')).not.toBeNull();
    });

    it('should show the first resource on / when there is only one resource and no dashboard', () => {
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory({ initialEntries: ['/'] })}
            >
                <RoutesWithLayout firstResource="default" catchAll={CatchAll}>
                    <Resource name="default" />
                </RoutesWithLayout>
            </CoreAdminContext>
        );

        expect(screen.queryByText('default')).not.toBeNull();
    });

    it('should show the first resource on / when there are multiple resource and no dashboard', () => {
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory({ initialEntries: ['/'] })}
            >
                <RoutesWithLayout firstResource="default" catchAll={CatchAll}>
                    <Resource name="default" />
                    <Resource name="another" />
                    <Resource name="yetanother" />
                </RoutesWithLayout>
            </CoreAdminContext>
        );

        expect(screen.queryByText('default')).not.toBeNull();
        expect(screen.queryByText('another')).toBeNull();
        expect(screen.queryByText('yetanother')).toBeNull();
    });

    it('should accept custom routes', () => {
        render(
            <CoreAdminContext
                dataProvider={testDataProvider()}
                history={createMemoryHistory({ initialEntries: ['/custom'] })}
            >
                <RoutesWithLayout catchAll={CatchAll} firstResource="default">
                    <Resource name="default" />
                    <Resource name="another" />
                    <Resource name="yetanother" />
                    <CustomRoutes>
                        <Route path="/custom" element={<Custom />} />
                    </CustomRoutes>
                </RoutesWithLayout>
            </CoreAdminContext>
        );

        expect(screen.queryByText('Custom')).not.toBeNull();
    });
});
