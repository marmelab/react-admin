import * as React from 'react';
import { Route } from 'react-router';
import { CoreAdmin } from './CoreAdmin';
import { useLogin } from '../auth';
import { CustomRoutes } from './CustomRoutes';
import { Resource } from './Resource';
import { FakeBrowserDecorator } from '../storybook/FakeBrowser';

export default {
    title: 'ra-core/core/CustomRoutes',
    decorators: [FakeBrowserDecorator],
    parameters: {
        initialEntries: ['/password-recovery'],
    },
};

export const UnauthenticatedCustomRoute = () => {
    return (
        <CoreAdmin
            authProvider={authProvider}
            dataProvider={dataProvider}
            loginPage={Login}
        >
            <CustomRoutes noLayout>
                <Route
                    path="/password-recovery"
                    element={<PasswordRecovery />}
                />
            </CustomRoutes>
            <Resource name="posts" list={PostList} />
        </CoreAdmin>
    );
};
const dataProvider: any = {
    getList: () => Promise.resolve({ data: [], total: 0 }),
    getOne: () => Promise.resolve({ data: { id: 0 } }),
    getMany: () => Promise.resolve({ data: [] }),
    getManyReference: () => Promise.resolve({ data: [], total: 0 }),
    create: () => Promise.resolve({ data: {} }),
    update: () => Promise.resolve({ data: {} }),
    delete: () => Promise.resolve({ data: {} }),
    updateMany: () => Promise.resolve({ data: [] }),
    deleteMany: () => Promise.resolve({ data: [] }),
};

let signedIn = false;
const authProvider = {
    login: () => {
        signedIn = true;
        return Promise.resolve({ data: { id: '123' } });
    },
    logout: () => Promise.resolve(),
    checkAuth: () => (signedIn ? Promise.resolve() : Promise.reject()),
    checkError: () => Promise.reject(),
    getPermissions: () => Promise.resolve(),
};

const Login = () => {
    const login = useLogin();
    return (
        <div>
            <h1>Login page</h1>
            <button onClick={() => login({})}>Sign in</button>
        </div>
    );
};

const PostList = () => (
    <div>
        <h1>PostList page</h1>
    </div>
);

const PasswordRecovery = () => {
    return (
        <div>
            <h1>Password recovery</h1>
        </div>
    );
};
