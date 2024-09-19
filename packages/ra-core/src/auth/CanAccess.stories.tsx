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

export const Basic = () => (
    <CoreAdminContext
        authProvider={defaultAuthProvider}
        loading={() => <div>Loading...</div>}
        unauthorized={() => <div>Unauthorized</div>}
    >
        <CanAccess action="read" resource="test">
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const Unauthorized = () => (
    <CoreAdminContext
        authProvider={defaultAuthProvider}
        loading={() => <div>Loading...</div>}
        unauthorized={() => <div>Unauthorized</div>}
    >
        <CanAccess action="show" resource="test">
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const CustomLoading = () => (
    <CoreAdminContext
        authProvider={defaultAuthProvider}
        loading={() => <div>Loading...</div>}
        unauthorized={() => <div>Unauthorized</div>}
    >
        <CanAccess
            action="read"
            resource="test"
            loading={<div>Please wait...</div>}
        >
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const CustomUnauthorized = () => (
    <CoreAdminContext
        authProvider={defaultAuthProvider}
        loading={() => <div>Loading...</div>}
        unauthorized={() => <div>Unauthorized</div>}
    >
        <CanAccess
            action="show"
            resource="test"
            unauthorized={<div>Not allowed</div>}
        >
            protected content
        </CanAccess>
    </CoreAdminContext>
);

export const NoAuthProvider = () => (
    <CoreAdminContext
        authProvider={undefined}
        loading={() => <div>Loading...</div>}
        unauthorized={() => <div>Unauthorized</div>}
    >
        <CanAccess action="read" resource="test">
            protected content
        </CanAccess>
    </CoreAdminContext>
);
