import { useGetList } from 'react-admin';
import { LoginForm } from './LoginForm';
import { Navigate } from 'react-router-dom';
import { LoginSkeleton } from './LoginSkeleton';

export const LoginPage = () => {
    const { total, isPending, error } = useGetList('users', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });

    if (isPending) return <LoginSkeleton />;
    if (error) return <LoginForm />;
    if (total && total > 0) return <LoginForm />;

    return <Navigate to="/sign-up" />;
};
