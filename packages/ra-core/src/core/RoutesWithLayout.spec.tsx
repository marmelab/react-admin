import * as React from 'react';
import expect from 'expect';
import { Route, MemoryRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { waitForDomChange, cleanup } from '@testing-library/react';

import RoutesWithLayout from './RoutesWithLayout';
import renderWithRedux from '../util/renderWithRedux';
import { registerResource } from '../actions';

describe('<RoutesWithLayout>', () => {
    afterEach(cleanup);

    const Dashboard = () => <div>Dashboard</div>;
    const Custom = ({ name }) => <div>Custom</div>;
    const FirstResource = ({ name }) => <div>Default</div>;
    const Resource = ({ name }) => <div>Resource</div>;

    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const initialState = {
        admin: { resources: {} },
        router: { location: { pathname: '/' } },
    };

    it('should show dashboard on / when provided', async () => {
        const App = () => {
            const dispatch = useDispatch();
            React.useEffect(() => {
                setTimeout(
                    () => dispatch(registerResource({ name: 'foo' })),
                    10
                );
            }, [dispatch]);
            return (
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout dashboard={Dashboard}>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            );
        };
        const { queryByText } = renderWithRedux(<App />, initialState);

        // dashboard should be hidden on first render, until the resources register
        expect(queryByText('Dashboard')).toBeNull();
        // then it shows once the resources have registered
        await waitForDomChange();
        expect(queryByText('Dashboard')).not.toBeNull();
    });

    it('should show the first resource on / when there is only one resource and no dashboard', () => {
        const { queryByText } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <RoutesWithLayout>
                    <FirstResource name="default" />
                </RoutesWithLayout>
            </MemoryRouter>,
            initialState
        );

        expect(queryByText('Default')).not.toBeNull();
    });

    it('should show the first resource on / when there are multiple resource and no dashboard', () => {
        const { queryByText } = renderWithRedux(
            <MemoryRouter initialEntries={['/']}>
                <RoutesWithLayout>
                    <FirstResource name="default" />
                    <Resource name="another" />
                    <Resource name="yetanother" />
                </RoutesWithLayout>
            </MemoryRouter>,
            initialState
        );

        expect(queryByText('Default')).not.toBeNull();
        expect(queryByText('Resource')).toBeNull();
    });

    it('should accept custom routes', () => {
        const customRoutes = [
            <Route key="custom" path="/custom" component={Custom} />,
        ]; // eslint-disable-line react/jsx-key
        const { queryByText } = renderWithRedux(
            <MemoryRouter initialEntries={['/custom']}>
                <RoutesWithLayout customRoutes={customRoutes}>
                    <FirstResource name="default" />
                    <Resource name="another" />
                    <Resource name="yetanother" />
                </RoutesWithLayout>
            </MemoryRouter>,
            initialState
        );

        expect(queryByText('Custom')).not.toBeNull();
    });
});
