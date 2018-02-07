import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { mount } from 'enzyme';
import assert from 'assert';

import RoutesWithLayout from './RoutesWithLayout';

describe('<RoutesWithLayout>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const Custom = () => <div>Custom</div>;
    const FirstResource = () => <div>Default</div>;
    const Resource = () => <div>Resource</div>;

    // the Provider is required because the dashboard is wrapped by <Authenticated>, which is a connected component
    const store = createStore(() => ({
        admin: { auth: { isLoggedIn: true } },
    }));

    it('should show dashboard on / when provided', () => {
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout
                        dashboard={Dashboard}
                        declareResources={() => true}
                    >
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.find(Dashboard).length, 1);
    });

    it('should show the first resource on / when there is only one resource and no dashboard', () => {
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout declareResources={() => true}>
                        <FirstResource name="default" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        assert.equal(wrapper.find(FirstResource).length, 1);
    });

    it('should show the first resource on / when there are multiple resource and no dashboard', () => {
        const wrapper = mount(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <RoutesWithLayout declareResources={() => true}>
                        <FirstResource name="default" />
                        <Resource name="another" />
                        <Resource name="yetanother" />
                    </RoutesWithLayout>
                </MemoryRouter>
            </Provider>
        );

        assert.equal(wrapper.find(FirstResource).length, 1);
        assert.equal(wrapper.find(Resource).length, 0);
    });

    it('should accept custom routes', () => {
        const customRoutes = [<Route path="/custom" component={Custom} />]; // eslint-disable-line react/jsx-key
        const wrapper = mount(
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
        assert.equal(wrapper.find(Custom).length, 1);
    });
});
