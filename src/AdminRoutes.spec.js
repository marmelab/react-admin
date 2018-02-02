/* eslint react/jsx-key: off, react/display-name: off */
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

    const defaultProps = {
        customRoutes: [],
        appLayout: ({ children }) => <div className="layout">{children}</div>,
    };

    it('should show dashboard on / when provided', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <AdminRoutes
                        {...defaultProps}
                        dashboard={Dashboard}
                        resources={resources}
                    />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            wrapper.html(),
            '<div class="layout"><div>Dashboard</div></div>'
        );
    });
    it('should show resource list on /[resourcename]', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts']}>
                    <AdminRoutes {...defaultProps} resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            wrapper.html(),
            '<div class="layout"><div>PostList</div></div>'
        );
    });
    it('should show resource edit on /[resourcename]/:id', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12']}>
                    <AdminRoutes {...defaultProps} resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            wrapper.html(),
            '<div class="layout"><div>PostEdit</div></div>'
        );
    });
    it('should show resource show on /[resourcename]/:id/show', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12/show']}>
                    <AdminRoutes {...defaultProps} resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            wrapper.html(),
            '<div class="layout"><div>PostShow</div></div>'
        );
    });
    it('should show resource delete on /[resourcename]/:id/delete', () => {
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/posts/12/delete']}>
                    <AdminRoutes {...defaultProps} resources={resources} />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            wrapper.html(),
            '<div class="layout"><div>PostDelete</div></div>'
        );
    });
    it('should accept custom routes without layout', () => {
        const customRoutes = [
            <Route path="/custom" component={Custom} noLayout />,
        ];
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <AdminRoutes
                        {...defaultProps}
                        resources={resources}
                        customRoutes={customRoutes}
                    />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(wrapper.html(), '<div>Custom</div>');
    });
    it('should accept custom routes with layout', () => {
        const customRoutes = [<Route path="/custom" component={Custom} />];
        const wrapper = render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/custom']}>
                    <AdminRoutes
                        {...defaultProps}
                        resources={resources}
                        customRoutes={customRoutes}
                    />
                </MemoryRouter>
            </Provider>
        );
        assert.equal(
            wrapper.html(),
            '<div class="layout"><div>Custom</div></div>'
        );
    });
    it('should filter null children', () => {
        const condition = false;
        const declareResources = sinon.spy();
        shallow(
            <AdminRoutes {...defaultProps} declareResources={declareResources}>
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
                {...defaultProps}
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
