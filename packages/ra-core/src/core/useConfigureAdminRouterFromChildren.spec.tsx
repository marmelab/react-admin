import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { createMemoryHistory } from 'history';
import { useResourceDefinitions } from './useResourceDefinitions';
import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { Resource } from './Resource';
import { CoreLayoutProps } from '../types';

const ResourceDefinitionsTestComponent = () => {
    const definitions = useResourceDefinitions();
    if (!definitions) return null;
    return (
        <ul>
            {Object.keys(definitions).map(key => (
                <li key={key}>{JSON.stringify(definitions[key])}</li>
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

const TestedComponent = ({ role }) => {
    const history = createMemoryHistory();

    return (
        <CoreAdminContext history={history}>
            <CoreAdminRoutes
                layout={MyLayout}
                catchAll={CatchAll}
                loading={Loading}
            >
                <Resource name="posts" />
                <Resource name="comments" />
                {() =>
                    role === 'admin'
                        ? [<Resource name="user" />, <Resource name="admin" />]
                        : role === 'user'
                        ? [<Resource name="user" />]
                        : []
                }
            </CoreAdminRoutes>
        </CoreAdminContext>
    );
};

const expectResource = (resource: string) =>
    expect(screen.queryByText(`"name":"${resource}"`, { exact: false }));

describe('useConfigureAdminRouterFromChildren', () => {
    it('should always load static resources', async () => {
        render(<TestedComponent role="guest" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        expectResource('posts').not.toBeNull();
        expectResource('comments').not.toBeNull();
        expectResource('user').toBeNull();
        expectResource('admin').toBeNull();
    });
    it('should load dynamic resource definitions', async () => {
        render(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        expectResource('user').not.toBeNull();
        expectResource('admin').not.toBeNull();
    });
    it('should allow adding new resource after the first render', async () => {
        const { rerender } = render(<TestedComponent role="user" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        expectResource('posts').not.toBeNull();
        expectResource('comments').not.toBeNull();
        expectResource('user').not.toBeNull();
        expectResource('admin').toBeNull();

        rerender(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        expectResource('posts').not.toBeNull();
        expectResource('comments').not.toBeNull();
        expectResource('user').not.toBeNull();
        expectResource('admin').not.toBeNull();
    });
    it('should allow removing a resource after the first render', async () => {
        const { rerender } = render(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        expectResource('posts').not.toBeNull();
        expectResource('comments').not.toBeNull();
        expectResource('user').not.toBeNull();
        expectResource('admin').not.toBeNull();

        rerender(<TestedComponent role="user" />);
        await waitFor(() => expect(screen.queryByText('Loading')).toBeNull());
        expectResource('posts').not.toBeNull();
        expectResource('comments').not.toBeNull();
        expectResource('user').not.toBeNull();
        expectResource('admin').toBeNull();
    });
});
