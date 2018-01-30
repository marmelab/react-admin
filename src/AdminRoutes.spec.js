import React from 'react';
import { Route, MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { render, shallow } from 'enzyme';
import assert from 'assert';
import sinon from 'sinon';

import { AdminRoutes } from './AdminRoutes';
import Resource from './Resource';

describe('<AdminRoutes>', () => {
    const Dashboard = () => <div>Dashboard</div>;
    const PostList = () => <div>PostList</div>;
    const PostEdit = () => <div>PostEdit</div>;
    const PostCreate = () => <div>PostCreate</div>;
    const PostShow = () => <div>PostShow</div>;
    const PostDelete = () => <div>PostDelete</div>;
    const Custom = () => <div>Custom</div>;
    // the Provider is required because the dashboard is wrapped by <Restricted>, which is a connected component
    const store = createStore(x => x);
    const resources = [
        {
            name: 'posts',
            list: PostList,
            edit: PostEdit,
            create: PostCreate,
            show: PostShow,
            remove: PostDelete,
        },
    ];
    it('should show dashboard on / when provided', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <AdminRoutes dashboard={Dashboard} resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>Dashboard</div>');
    });
    it('should show resource list on /[resourcename]', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts']}>
                    <AdminRoutes resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostList</div>');
    });
    it('should show resource edit on /[resourcename]/:id', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12']}>
                    <AdminRoutes resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostEdit</div>');
    });
    it('should show resource show on /[resourcename]/:id/show', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12/show']}>
                    <AdminRoutes resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostShow</div>');
    });
    it('should show resource delete on /[resourcename]/:id/delete', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12/delete']}>
                    <AdminRoutes resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>PostDelete</div>');
    });
    it('should accept custom routes', () => {
        const customRoutes = [<Route path="/custom" component={Custom} />]; // eslint-disable-line react/jsx-key
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <AdminRoutes
                        resources={resources}
                        customRoutes={customRoutes}
                    />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>Custom</div>');
    });
    it('should filter null children', () => {
        const condition = false;
        const declareResources = sinon.spy();
        shallow(
            <AdminRoutes declareResources={declareResources}>
                <Resource name="product" />
                {condition && <Resource name="product1" />}
                {condition ? <Resource name="product2" /> : null}
            </AdminRoutes>,
            { lifecycleExperimental: true }
        );
        assert(
            declareResources.called,
            'declareResources should have been called'
        );

        assert.equal(declareResources.args[0][0].length, 1);
        assert.equal(declareResources.args[0][0][0].name, 'product');
    });
    it('should filter null children from children function', () => {
        const condition = false;
        const declareResources = sinon.spy();
        const authClient = sinon.spy(() => Promise.resolve());
        shallow(
            <AdminRoutes
                authClient={authClient}
                declareResources={declareResources}
            >
                {() => [
                    <Resource key="product" name="product" />,
                    condition && <Resource name="product1" />,
                    condition ? <Resource name="product2" /> : null,
                ]}
            </AdminRoutes>,
            { lifecycleExperimental: true }
        );

        // We need a timeout because of the authClient returning a promise
        return new Promise(resolve => {
            setTimeout(() => {
                assert(
                    declareResources.called,
                    'declareResources should have been called'
                );

                assert.equal(declareResources.args[0][0].length, 1);
                assert.equal(declareResources.args[0][0][0].name, 'product');
                resolve();
            }, 100);
        });
    });
});
