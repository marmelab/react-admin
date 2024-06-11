import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { Route } from 'react-router-dom';
import { useResourceDefinitions } from './useResourceDefinitions';

import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { Resource } from './Resource';
import { CustomRoutes } from './CustomRoutes';
import { CoreLayoutProps } from '../types';
import { AuthProvider, ResourceProps } from '..';
import { TestMemoryRouter } from '../routing';

const ResourceDefinitionsTestComponent = () => {
    const definitions = useResourceDefinitions();
    if (!definitions) return null;
    return (
        <ul>
            {Object.keys(definitions).map(key => (
                <li key={key} data-resource={key}>
                    {JSON.stringify(definitions[key])}
                </li>
            ))}
        </ul>
    );
};

const MyLayout = ({ children }: CoreLayoutProps) => (
    <>
        <ResourceDefinitionsTestComponent />
        {children}
    </>
);
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;
const Ready = () => <>Ready</>;

const TestedComponent = ({ role }) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext>
                <CoreAdminRoutes
                    layout={MyLayout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <Resource name="posts" />
                    <Resource name="comments" />
                    {() =>
                        role === 'admin'
                            ? [
                                  <Resource name="user" />,
                                  <Resource name="admin" />,
                              ]
                            : role === 'user'
                              ? [<Resource name="user" />]
                              : []
                    }
                </CoreAdminRoutes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const TestedComponentReturningNull = ({ role }) => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext>
                <CoreAdminRoutes
                    layout={MyLayout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <Resource name="posts" />
                    <Resource name="comments" />
                    {() =>
                        role === 'admin'
                            ? [
                                  <Resource name="user" />,
                                  <Resource name="admin" />,
                              ]
                            : role === 'user'
                              ? [<Resource name="user" />]
                              : null
                    }
                </CoreAdminRoutes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const TestedComponentWithAuthProvider = ({ callback }) => {
    const authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        getPermissions: () => Promise.resolve('admin'),
    };

    return (
        <TestMemoryRouter>
            <CoreAdminContext authProvider={authProvider}>
                <CoreAdminRoutes
                    layout={MyLayout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <Resource name="posts" />
                    <Resource name="comments" />
                    {callback}
                </CoreAdminRoutes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const ResourceWithPermissions = (props: ResourceProps) => (
    <Resource {...props} />
);
ResourceWithPermissions.raName = 'Resource';
ResourceWithPermissions.registerResource = (
    { create, edit, icon, list, name, options, show }: ResourceProps,
    permissions: any
) => ({
    name,
    options,
    hasList: !!list && permissions && permissions[name]?.list,
    hasCreate: !!create && permissions && permissions[name]?.create,
    hasEdit: !!edit && permissions && permissions[name]?.edit,
    hasShow: !!show && permissions && permissions[name]?.show,
    icon,
});

const TestedComponentWithPermissions = () => {
    const authProvider: AuthProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        getPermissions: () =>
            Promise.resolve({
                posts: {
                    list: true,
                    create: true,
                    edit: true,
                    show: true,
                },
                comments: {
                    list: true,
                    create: false,
                    edit: false,
                    show: true,
                },
                users: {
                    list: true,
                    create: false,
                    edit: false,
                    show: false,
                },
            }),
    };

    return (
        <TestMemoryRouter>
            <CoreAdminContext authProvider={authProvider}>
                <CoreAdminRoutes
                    layout={MyLayout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <ResourceWithPermissions
                        name="posts"
                        list={<div />}
                        create={<div />}
                        edit={<div />}
                        show={<div />}
                    />
                    <ResourceWithPermissions
                        name="comments"
                        list={<div />}
                        create={<div />}
                        edit={<div />}
                        show={<div />}
                    />
                    <ResourceWithPermissions
                        name="users"
                        list={<div />}
                        create={<div />}
                        edit={<div />}
                        show={<div />}
                    />
                </CoreAdminRoutes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const TestedComponentWithOnlyLazyCustomRoutes = ({ navigateCallback }) => {
    const [lazyRoutes, setLazyRoutes] =
        React.useState<React.ReactElement | null>(null);

    React.useEffect(() => {
        const timer = setTimeout(
            () =>
                setLazyRoutes(
                    <CustomRoutes>
                        <Route path="/foo" element={<div>Foo</div>} />
                    </CustomRoutes>
                ),
            500
        );
        return () => clearTimeout(timer);
    }, [setLazyRoutes]);

    return (
        <TestMemoryRouter navigateCallback={navigateCallback}>
            <CoreAdminContext>
                <CoreAdminRoutes
                    layout={MyLayout}
                    catchAll={CatchAll}
                    loading={Loading}
                    ready={Ready}
                >
                    {lazyRoutes}
                </CoreAdminRoutes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

const TestedComponentWithForcedRoutes = () => {
    return (
        <TestMemoryRouter>
            <CoreAdminContext>
                <CoreAdminRoutes
                    layout={MyLayout}
                    catchAll={CatchAll}
                    loading={Loading}
                >
                    <Resource
                        name="posts"
                        list={<div />}
                        hasCreate
                        hasEdit
                        hasShow
                    />
                    <Resource name="comments" list={<div />} />
                    {() => [<Resource name="user" list={<div />} hasEdit />]}
                </CoreAdminRoutes>
            </CoreAdminContext>
        </TestMemoryRouter>
    );
};

describe('useConfigureAdminRouterFromChildren', () => {
    it('should always load static resources', async () => {
        render(<TestedComponent role="guest" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"posts"`, { exact: false });
        await screen.findByText(`"name":"comments"`, { exact: false });
        expect(
            screen.queryByText(`"name":"user"`, { exact: false })
        ).toBeNull();
        expect(
            screen.queryByText(`"name":"admin"`, { exact: false })
        ).toBeNull();
    });
    it('should not call the children function until the permissions have been retrieved', async () => {
        const callback = jest.fn(() =>
            Promise.resolve(resolve => setTimeout(resolve, 50))
        );

        render(<TestedComponentWithAuthProvider callback={callback} />);
        await waitFor(() => expect(callback).toHaveBeenCalled());

        expect(callback).not.toHaveBeenCalledWith(undefined);
    });
    it('should load dynamic resource definitions', async () => {
        render(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"user"`, { exact: false });
        await screen.findByText(`"name":"admin"`, { exact: false });
    });
    it('should accept function returning null', async () => {
        render(<TestedComponentReturningNull role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"user"`, { exact: false });
        await screen.findByText(`"name":"admin"`, { exact: false });
    });
    it('should call registerResource with the permissions', async () => {
        render(<TestedComponentWithPermissions />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"posts"`, {
            exact: false,
        });
        await screen.findByText(`"hasList":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasCreate":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasShow":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasList":true`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasShow":true`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasCreate":false`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasEdit":false`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasList":true`, {
            selector: `[data-resource=users]`,
            exact: false,
        });
        await screen.findByText(`"hasShow":false`, {
            selector: `[data-resource=users]`,
            exact: false,
        });
        await screen.findByText(`"hasCreate":false`, {
            selector: `[data-resource=users]`,
            exact: false,
        });
        await screen.findByText(`"hasEdit":false`, {
            selector: `[data-resource=users]`,
            exact: false,
        });
    });
    it('should allow adding new resource after the first render', async () => {
        const { rerender } = render(<TestedComponent role="user" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"posts"`, { exact: false });
        await screen.findByText(`"name":"comments"`, { exact: false });
        await screen.findByText(`"name":"user"`, { exact: false });
        expect(
            screen.queryByText(`"name":"admin"`, { exact: false })
        ).toBeNull();

        rerender(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"posts"`, { exact: false });
        await screen.findByText(`"name":"comments"`, { exact: false });
        await screen.findByText(`"name":"user"`, { exact: false });
        await screen.findByText(`"name":"admin"`, { exact: false });
    });
    it('should allow removing a resource after the first render', async () => {
        const { rerender } = render(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"posts"`, { exact: false });
        await screen.findByText(`"name":"comments"`, { exact: false });
        await screen.findByText(`"name":"user"`, { exact: false });
        await screen.findByText(`"name":"admin"`, { exact: false });

        rerender(<TestedComponent role="user" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        await screen.findByText(`"name":"posts"`, { exact: false });
        await screen.findByText(`"name":"comments"`, { exact: false });
        await screen.findByText(`"name":"user"`, { exact: false });
        expect(
            screen.queryByText(`"name":"admin"`, { exact: false })
        ).toBeNull();
    });
    it('should allow dynamically loaded custom routes without any resources', async () => {
        let navigate;
        render(
            <TestedComponentWithOnlyLazyCustomRoutes
                navigateCallback={n => {
                    navigate = n;
                }}
            />
        );
        expect(screen.queryByText('Ready')).not.toBeNull();

        await new Promise(resolve => setTimeout(resolve, 1010));
        expect(screen.queryByText('Ready')).toBeNull();
        navigate('/foo');
        await screen.findByText('Foo');
    });
    it('should support forcing hasEdit hasCreate or hasShow', async () => {
        render(<TestedComponentWithForcedRoutes />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());

        await screen.findByText(`"hasList":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasShow":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasEdit":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasCreate":true`, {
            selector: `[data-resource=posts]`,
            exact: false,
        });
        await screen.findByText(`"hasList":true`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasShow":false`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasEdit":false`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasCreate":false`, {
            selector: `[data-resource=comments]`,
            exact: false,
        });
        await screen.findByText(`"hasList":true`, {
            selector: `[data-resource=user]`,
            exact: false,
        });
        await screen.findByText(`"hasShow":false`, {
            selector: `[data-resource=user]`,
            exact: false,
        });
        await screen.findByText(`"hasEdit":true`, {
            selector: `[data-resource=user]`,
            exact: false,
        });
        await screen.findByText(`"hasCreate":false`, {
            selector: `[data-resource=user]`,
            exact: false,
        });
    });
});
