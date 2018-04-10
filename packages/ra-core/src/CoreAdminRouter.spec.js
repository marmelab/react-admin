import React from 'react';
import { shallow } from 'enzyme';
import assert from 'assert';
import { Route } from 'react-router-dom';

import { CoreAdminRouter } from './CoreAdminRouter';
import Resource from './Resource';

describe('<AdminRouter>', () => {
    const defaultProps = {
        authProvider: () => Promise.resolve(),
        customRoutes: [],
    };

    describe('With resources as regular children', () => {
        it('should render all resources with a registration context', () => {
            const wrapper = shallow(
                <CoreAdminRouter {...defaultProps}>
                    <Resource name="posts" />
                    <Resource name="comments" />
                </CoreAdminRouter>
            );

            const resources = wrapper.find('Connect(Resource)');

            assert.equal(resources.length, 2);
            assert.deepEqual(
                resources.map(resource => resource.prop('context')),
                ['registration', 'registration']
            );
        });
    });

    describe('With resources returned from a function as children', () => {
        it('should render all resources with a registration context', async () => {
            const wrapper = shallow(
                <CoreAdminRouter {...defaultProps}>
                    {() => [
                        <Resource key="posts" name="posts" />,
                        <Resource key="comments" name="comments" />,
                        null,
                    ]}
                </CoreAdminRouter>
            );

            // Timeout needed because of the authProvider call
            await new Promise(resolve => {
                setTimeout(resolve, 10);
            });

            wrapper.update();
            const resources = wrapper.find('Connect(Resource)');
            assert.equal(resources.length, 2);
            assert.deepEqual(
                resources.map(resource => resource.prop('context')),
                ['registration', 'registration']
            );
        });
    });

    it('should render the custom routes which do not need a layout', () => {
        const Bar = () => <div>Bar</div>;

        const wrapper = shallow(
            <CoreAdminRouter
                customRoutes={[
                    <Route
                        key="custom"
                        noLayout
                        exact
                        path="/custom"
                        render={() => <div>Foo</div>}
                    />,
                    <Route
                        key="custom2"
                        noLayout
                        exact
                        path="/custom2"
                        component={Bar}
                    />,
                ]}
                location={{ pathname: '/custom' }}
            >
                <Resource name="posts" />
                <Resource name="comments" />
            </CoreAdminRouter>
        );

        const routes = wrapper.find('Route');
        assert.equal(routes.at(0).prop('path'), '/custom');
        assert.equal(routes.at(1).prop('path'), '/custom2');
    });
});
