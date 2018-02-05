import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render } from 'enzyme';
import { html } from 'cheerio';
import assert from 'assert';

import RoutesWithLayout from './RoutesWithLayout';

describe('<RoutesWithLayout>', () => {
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
                    <RoutesWithLayout
                        dashboard={Dashboard}
                        declareResources={() => true}
                    >
                        <div />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );
        assert.equal(html(wrapper), '<div>Dashboard</div>');
    });

    it('should accept custom routes', () => {
        const customRoutes = [<Route path="/custom" component={Custom} />]; // eslint-disable-line react/jsx-key
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <RoutesWithLayout customRoutes={customRoutes}>
                        <div />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );
        assert.equal(html(wrapper), '<div>Custom</div>');
    });
});
