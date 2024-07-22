import { useGetList } from 'react-admin';
import { Navigate } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import { LoginSkeleton } from './LoginSkeleton';

export const LoginPage = () => {
    const { total, isPending, error } = useGetList('sales', {
        pagination: { page: 1, perPage: 10 },
        sort: { field: 'name', order: 'ASC' },
    });

    if (isPending) return <LoginSkeleton />;
    if (error) return <LoginForm />;
    if (total && total > 0) return <LoginForm />;

    return <Navigate to="/sign-up" />;
};
