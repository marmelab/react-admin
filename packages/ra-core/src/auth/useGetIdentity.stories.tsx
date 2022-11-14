import * as React from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { useGetIdentity } from './useGetIdentity';
import AuthContext from './AuthContext';

export default {
    title: 'ra-core/auth/useGetIdentity',
};

const authProvider = {
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
    getIdentity: () => Promise.resolve({ id: 1, fullName: 'John Doe' }),
};

const Identity = () => {
    const { data, error, isLoading } = useGetIdentity();
    return isLoading ? <>Loading</> : error ? <>Error</> : <>{data.fullName}</>;
};

export const Basic = () => (
    <QueryClientProvider client={new QueryClient()}>
        <AuthContext.Provider value={authProvider}>
            <Identity />
        </AuthContext.Provider>
    </QueryClientProvider>
);

export const ErrorCase = () => (
    <QueryClientProvider
        client={
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                    },
                },
            })
        }
    >
        <AuthContext.Provider
            value={{
                ...authProvider,
                getIdentity: () => Promise.reject(new Error('Error')),
            }}
        >
            <Identity />
        </AuthContext.Provider>
    </QueryClientProvider>
);

export const ResetIdentity = () => {
    let fullName = 'John Doe';

    const IdentityForm = () => {
        const { isLoading, error, data, refetch } = useGetIdentity();
        const [newIdentity, setNewIdentity] = React.useState('');

        if (isLoading) return <>Loading</>;
        if (error) return <>Error</>;

        const handleChange = event => {
            setNewIdentity(event.target.value);
        };

        const handleSubmit = e => {
            e.preventDefault();
            if (!newIdentity) return;
            fullName = newIdentity;
            refetch();
        };

        return (
            <form onSubmit={handleSubmit}>
                <input defaultValue={data.fullName} onChange={handleChange} />
                <input type="submit" value="Save" />
            </form>
        );
    };

    return (
        <QueryClientProvider client={new QueryClient()}>
            <AuthContext.Provider
                value={{
                    ...authProvider,
                    getIdentity: () => Promise.resolve({ id: 1, fullName }),
                }}
            >
                <Identity />
                <IdentityForm />
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};
