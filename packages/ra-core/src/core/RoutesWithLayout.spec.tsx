import * as React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';

import RoutesWithLayout from './RoutesWithLayout';

describe('<RoutesWithLayout>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const Custom = ({ name }) => <div>Custom</div>;
    const FirstResource = ({ name }) => <div>Default</div>;
    const Resource = ({ name }) => <div>Resource</div>;

    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const store = createStore(() => ({
        admin: {},
        router: { location: { pathname: '/' } },
    }));

    it('should show dashboard on / when provided', () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout dashboard={Dashboard}>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(queryByText('Dashboard')).not.toBeNull();
    });

    it('should show the first resource on / when there is only one resource and no dashboard', () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout>
                        <FirstResource name="default" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(queryByText('Default')).not.toBeNull();
    });

    it('should show the first resource on / when there are multiple resource and no dashboard', () => {
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(queryByText('Default')).not.toBeNull();
        expect(queryByText('Resource')).toBeNull();
    });

    it('should accept custom routes', () => {
        const customRoutes = [
            <Route key="custom" path="/custom" component={Custom} />,
        ]; // eslint-disable-line react/jsx-key
        const { queryByText } = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <RoutesWithLayout customRoutes={customRoutes}>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        expect(queryByText('Custom')).not.toBeNull();
    });
});
