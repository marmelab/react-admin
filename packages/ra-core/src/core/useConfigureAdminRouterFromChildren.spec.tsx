import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { createMemoryHistory } from 'history';
import { useResourceDefinitions } from './useResourceDefinitions';
import { CoreAdminContext } from './CoreAdminContext';
import { CoreAdminRoutes } from './CoreAdminRoutes';
import { Resource } from './Resource';
import { CoreLayoutProps } from '../types';
import { testDataProvider } from '../dataProvider';

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
    <div>
        <div>
            <ResourceDefinitionsTestComponent />
        </div>
        Layout {children}
    </div>
);
const CatchAll = () => <div />;
const Loading = () => <>Loading</>;

const authProvider = {
    login: jest.fn().mockResolvedValue(''),
    logout: jest.fn().mockResolvedValue(''),
    checkAuth: jest.fn().mockResolvedValue(''),
    checkError: jest.fn().mockResolvedValue(''),
    getPermissions: jest.fn().mockResolvedValue(''),
};

const TestedComponent = ({ role }) => {
    const history = createMemoryHistory();
    const getResourcesFromPermissions = _permissions => {
        if (role === 'admin') {
            return [
                <Resource
                    name="userResource"
                    list={() => <span>UserResourceList</span>}
                />,
                <Resource
                    name="adminResource"
                    list={() => <span>AdminResourceList</span>}
                />,
            ];
        }
        if (role === 'user') {
            return [
                <Resource
                    name="userResource"
                    list={() => <span>UserResourceList</span>}
                />,
            ];
        }
        return [];
    };

    return (
        <CoreAdminContext
            dataProvider={testDataProvider()}
            authProvider={authProvider}
            history={history}
        >
            <CoreAdminRoutes
                layout={MyLayout}
                catchAll={CatchAll}
                loading={Loading}
            >
                <Resource name="posts" list={() => <span>PostList</span>} />
                <Resource
                    name="comments"
                    list={() => <span>CommentList</span>}
                />
                {getResourcesFromPermissions}
            </CoreAdminRoutes>
        </CoreAdminContext>
    );
};

const expectResourceToBeRegistered = (
    resource: string,
    shouldBeRegistered = true
) => {
    if (shouldBeRegistered) {
        expect(
            screen.queryByText(`"name":"${resource}"`, { exact: false })
        ).not.toBeNull();
    } else {
        expect(
            screen.queryByText(`"name":"${resource}"`, { exact: false })
        ).toBeNull();
    }
};

describe('useConfigureAdminRouterFromChildren', () => {
    it('should load unrestricted resource definitions', async () => {
        render(<TestedComponent role="guest" />);
        await waitFor(() => expect(screen.getByText('Layout')).not.toBeNull());
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
    });
    it('should load unrestricted and user restricted resource definitions', async () => {
        render(<TestedComponent role="user" />);
        await waitFor(() => expect(screen.getByText('Layout')).not.toBeNull());
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
        expectResourceToBeRegistered('userResource');
        expectResourceToBeRegistered('adminResource', false);
    });
    it('should load unrestricted and admin restricted resource definitions', async () => {
        render(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.getByText('Layout')).not.toBeNull());
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
        expectResourceToBeRegistered('userResource');
        expectResourceToBeRegistered('adminResource');
    });
    it('should add admin resource definitions when logged as user and then as admin', async () => {
        const { rerender } = render(<TestedComponent role="user" />);
        await waitFor(() => expect(screen.getByText('Layout')).not.toBeNull());
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
        expectResourceToBeRegistered('userResource');
        expectResourceToBeRegistered('adminResource', false);

        rerender(<TestedComponent role="admin" />);
        await waitFor(() => expectResourceToBeRegistered('adminResource'));
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
        expectResourceToBeRegistered('userResource');
    });
    it('should remove admin resource definitions when logged as admin and then as user', async () => {
        const { rerender } = render(<TestedComponent role="admin" />);
        await waitFor(() => expect(screen.getByText('Layout')).not.toBeNull());
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
        expectResourceToBeRegistered('userResource');
        expectResourceToBeRegistered('adminResource');

        rerender(<TestedComponent role="user" />);
        await waitFor(() =>
            expectResourceToBeRegistered('adminResource', false)
        );
        expectResourceToBeRegistered('posts');
        expectResourceToBeRegistered('comments');
        expectResourceToBeRegistered('userResource');
    });
});
