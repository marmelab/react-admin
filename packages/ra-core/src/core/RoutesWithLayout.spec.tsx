import * as React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import { CustomRoutes } from './CustomRoutes';
import { RoutesWithLayout } from './RoutesWithLayout';

describe('<RoutesWithLayout>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const Custom = () => <div>Custom</div>;
    const Resource = ({ name }) => <div>{name}</div>;
    const CatchAll = () => <div>Catch all</div>;

    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const store = createStore(() => ({
        admin: {},
        router: { location: { pathname: '/' } },
    }));

    it('should show dashboard on / when provided', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout
                        catchAll={CatchAll}
                        dashboard={Dashboard}
                        firstResource="default"
                    >
                        <Resource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByText('Dashboard')).not.toBeNull();
    });

    it('should show the first resource on / when there is only one resource and no dashboard', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout
                        firstResource="default"
                        catchAll={CatchAll}
                    >
                        <Resource name="default" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByText('default')).not.toBeNull();
    });

    it('should show the first resource on / when there are multiple resource and no dashboard', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout
                        firstResource="default"
                        catchAll={CatchAll}
                    >
                        <Resource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByText('default')).not.toBeNull();
        expect(screen.queryByText('another')).toBeNull();
        expect(screen.queryByText('yetanother')).toBeNull();
    });

    it('should accept custom routes', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <RoutesWithLayout
                        catchAll={CatchAll}
                        firstResource="default"
                    >
                        <Resource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                        <CustomRoutes>
                            <Route path="/custom" element={<Custom />} />
                        </CustomRoutes>
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.queryByText('Custom')).not.toBeNull();
    });
});
