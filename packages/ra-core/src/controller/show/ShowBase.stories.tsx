import * as React from 'react';
import {
    AuthProvider,
    CoreAdminContext,
    ShowBase,
    ShowBaseProps,
    DataProvider,
    testDataProvider,
    useRecordContext,
} from '../..';

export default {
    title: 'ra-core/controller/ShowBase',
};

export const NoAuthProvider = ({
    dataProvider = defaultDataProvider,
    ...props
}: {
    dataProvider?: DataProvider;
} & Partial<ShowBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <ShowBase {...defaultProps} {...props}>
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

export const WithAuthProviderNoAccessControl = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
    },
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <ShowBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

export const AccessControl = ({
    authProvider = {
        login: () => Promise.resolve(),
        logout: () => Promise.resolve(),
        checkError: () => Promise.resolve(),
        checkAuth: () => new Promise(resolve => setTimeout(resolve, 300)),
        canAccess: () => new Promise(resolve => setTimeout(resolve, 300, true)),
    },
    dataProvider = defaultDataProvider,
}: {
    authProvider?: AuthProvider;
    dataProvider?: DataProvider;
}) => (
    <CoreAdminContext authProvider={authProvider} dataProvider={dataProvider}>
        <ShowBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </ShowBase>
    </CoreAdminContext>
);

const defaultDataProvider = testDataProvider({
    // @ts-ignore
    getOne: () => Promise.resolve({ data: { id: 12, test: 'Hello' } }),
});

const defaultProps = {
    id: 12,
    resource: 'posts',
};

const Child = () => {
    const record = useRecordContext();

    return <p>{record?.test}</p>;
};
