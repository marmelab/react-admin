import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'enzyme';
import { html } from 'cheerio';
import assert from 'assert';

import { AdminRoutes } from './AdminRoutes';

describe('<AdminRoutes>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const Custom = () => <div>Custom</div>;
    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const store = createStore(() => ({
        admin: { auth: { isLoggedIn: true } },
    }));

    it('should show dashboard on / when provided', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <AdminRoutes
                        dashboard={Dashboard}
                        declareResources={() => true}
                    >
                        <div />
                    </AdminRoutes>
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            html(wrapper),
            '<div><div context="registration"></div><div>Dashboard</div></div>'
        );
    });

    it('should accept custom routes', () => {
        const customRoutes = [<Route path="/custom" component={Custom} />]; // eslint-disable-line react/jsx-key
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <AdminRoutes customRoutes={customRoutes}>
                        <div />
                    </AdminRoutes>
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            html(wrapper),
            '<div><div context="registration"></div><div>Custom</div></div>'
        );
    });
});
