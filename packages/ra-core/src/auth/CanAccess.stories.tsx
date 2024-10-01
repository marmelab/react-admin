import * as React from 'react';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { CanAccess } from './CanAccess';

export default {
    title: 'ra-core/auth/CanAccess',
};

const defaultAuthProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.reject('bad method'),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.reject('bad method'),
    canAccess: ({ action }) =>
        new Promise(resolve => setTimeout(resolve, 500, action === 'read')),
};

export const Basic = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <CoreAdminContext authProvider={authProvider}>
        <CanAccess action="read" resource="test">
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const AccessDenied = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <CoreAdminContext authProvider={authProvider}>
        <CanAccess action="show" resource="test">
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const CustomLoading = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <CoreAdminContext authProvider={authProvider}>
        <CanAccess
            action="read"
            resource="test"
            loading={<div>Please wait...</div>}
        >
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const CustomAccessDenied = ({
    authProvider = defaultAuthProvider,
}: {
    authProvider?: AuthProvider;
}) => (
    <CoreAdminContext authProvider={authProvider}>
        <CanAccess
            action="show"
            resource="test"
            accessDenied={<div>Not allowed</div>}
        >
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const NoAuthProvider = () => (
    <CoreAdminContext authProvider={undefined}>
        <CanAccess action="read" resource="test">
            protected content
        </CanAccess>
    </CoreAdminContext>
);
