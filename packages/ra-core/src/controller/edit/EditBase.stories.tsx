import * as React from 'react';
import {
    AuthProvider,
    CoreAdminContext,
    EditBase,
    EditBaseProps,
    DataProvider,
    SaveHandlerCallbacks,
    testDataProvider,
    useSaveContext,
    useRecordContext,
} from '../..';

export default {
    title: 'ra-core/controller/EditBase',
};

export const NoAuthProvider = ({
    dataProvider = defaultDataProvider,
    callTimeOptions,
    ...props
}: {
    dataProvider?: DataProvider;
    callTimeOptions?: SaveHandlerCallbacks;
} & Partial<EditBaseProps>) => (
    <CoreAdminContext dataProvider={dataProvider}>
        <EditBase {...defaultProps} {...props}>
            <Child callTimeOptions={callTimeOptions} />
        </EditBase>
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
        <EditBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </EditBase>
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
        <EditBase
            {...defaultProps}
            loading={<div>Authentication loading...</div>}
        >
            <Child />
        </EditBase>
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

const Child = ({
    callTimeOptions,
}: {
    callTimeOptions?: SaveHandlerCallbacks;
}) => {
    const saveContext = useSaveContext();
    const record = useRecordContext();

    const handleClick = () => {
        if (!saveContext || !saveContext.save) return;
        saveContext.save({ test: 'test' }, callTimeOptions);
    };

    return (
        <>
            <p>{record?.test}</p>
            <button onClick={handleClick}>save</button>
        </>
    );
};
