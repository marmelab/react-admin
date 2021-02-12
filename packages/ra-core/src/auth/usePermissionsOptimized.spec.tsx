import * as React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import expect from 'expect';
import usePermissionsOptimized from './usePermissionsOptimized';
import AuthContext from './AuthContext';

describe('usePermissionsOptimized', () => {
    afterEach(cleanup);

    const CallPermissionsOnMount = ({ number, authParams }: any) => {
        const { permissions } = usePermissionsOptimized(authParams);
        return (
            <div>
                permissions {number}: {permissions}
            </div>
        );
    };

    it('returns undefined on mount', () => {
        const getPermissions = jest.fn(() => Promise.resolve('admin'));
        const { queryByText } = render(
            <AuthContext.Provider value={{ getPermissions } as any}>
                <div>
                    <CallPermissionsOnMount authParams={{ test: 1 }} />
                </div>
            </AuthContext.Provider>
        );
        expect(queryByText('permissions :')).not.toBeNull();
        expect(queryByText('permissions : admin')).toBeNull();
    });

    it('returns permissions from authProvider after resolve', async () => {
        const getPermissions = jest.fn(() => Promise.resolve('admin'));
        const { queryByText } = render(
            <AuthContext.Provider value={{ getPermissions } as any}>
                <div>
                    <CallPermissionsOnMount authParams={{ test: 2 }} />
                </div>
            </AuthContext.Provider>
        );
        await act(async () => await new Promise(r => setTimeout(r)));
        expect(queryByText('permissions :')).toBeNull();
        expect(queryByText('permissions : admin')).not.toBeNull();
    });

    it('does not rerender once the permissions have already been fetched', async () => {
        let renders = 0;
        const ComponentToTest = () => {
            const { permissions } = usePermissionsOptimized({ test: 3 });
            renders++;
            return <div>{permissions}</div>;
        };
        const getPermissions = jest.fn(() => Promise.resolve('admin'));

        // first usage
        const { queryByText } = render(
            <AuthContext.Provider value={{ getPermissions } as any}>
                <ComponentToTest />
            </AuthContext.Provider>
        );
        expect(renders).toBe(1); // renders on mount
        expect(getPermissions).toBeCalledTimes(1);
        expect(queryByText('admin')).toBeNull();
        await act(async () => await new Promise(r => setTimeout(r)));
        expect(renders).toBe(2); // re-renders when the getPermissions returns
        expect(queryByText('admin')).not.toBeNull();

        // second usage
        cleanup();
        renders = 0;
        const { queryByText: queryByText2 } = render(
            <AuthContext.Provider value={{ getPermissions } as any}>
                <ComponentToTest />
            </AuthContext.Provider>
        );
        expect(renders).toBe(1); // renders on mount
        expect(getPermissions).toBeCalledTimes(2);
        expect(queryByText2('admin')).not.toBeNull(); // answer from the cache
        await act(async () => await new Promise(r => setTimeout(r)));
        expect(renders).toBe(1); // does not rerender when the getPermissions returns the same permissions
    });

    it('can be called by two independent components', async () => {
        const getPermissions = jest.fn(() => Promise.resolve('admin'));
        const { queryByText } = render(
            <AuthContext.Provider value={{ getPermissions } as any}>
                <div>
                    <CallPermissionsOnMount
                        number={1}
                        authParams={{ test: 4 }}
                    />
                    <CallPermissionsOnMount
                        number={2}
                        authParams={{ test: 4 }}
                    />
                </div>
            </AuthContext.Provider>
        );
        expect(queryByText('permissions 1:')).not.toBeNull();
        expect(queryByText('permissions 2:')).not.toBeNull();
        expect(queryByText('permissions 1: admin')).toBeNull();
        expect(queryByText('permissions 2: admin')).toBeNull();
        expect(getPermissions).toBeCalledTimes(2);
        await act(async () => await new Promise(r => setTimeout(r)));
        expect(queryByText('permissions 1:')).toBeNull();
        expect(queryByText('permissions 2:')).toBeNull();
        expect(queryByText('permissions 1: admin')).not.toBeNull();
        expect(queryByText('permissions 2: admin')).not.toBeNull();
        expect(getPermissions).toBeCalledTimes(2);
    });
});
