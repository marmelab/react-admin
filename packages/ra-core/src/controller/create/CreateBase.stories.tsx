import * as React from 'react';
import {
    AuthProvider,
    CoreAdminContext,
    CreateBase,
    CreateBaseProps,
    DataProvider,
    SaveHandlerCallbacks,
    testDataProvider,
    useSaveContext,
} from '../..';

export default {
    title: 'ra-core/controller/CreateBase',
};

export const NoAuthProvider = ({
    dataProvider = defaultDataProvider,
    callTimeOptions,
    ...props
}: {
    dataProvider?: DataProvider;
    callTimeOptions?: SaveHandlerCallbacks;
} & Partial<CreateBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <CreateBase {...defaultProps} {...props}>
            <Child callTimeOptions={callTimeOptions} />
        </CreateBase>
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
        <CreateBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </CreateBase>
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
        <CreateBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </CreateBase>
    </CoreAdminContext>
);

const defaultDataProvider = testDataProvider({
    // @ts-ignore
    create: (_, { data }) => Promise.resolve({ data: { id: 1, ...data } }),
});

const defaultProps = {
    hasCreate: true,
    hasEdit: true,
    hasList: true,
    hasShow: true,
    id: 12,
    resource: 'posts',
};

const Child = ({
    callTimeOptions,
}: {
    callTimeOptions?: SaveHandlerCallbacks;
}) => {
    const saveContext = useSaveContext();

    const handleClick = () => {
        if (!saveContext || !saveContext.save) return;
        saveContext.save({ test: 'test' }, callTimeOptions);
    };

    return <button onClick={handleClick}>save</button>;
};
