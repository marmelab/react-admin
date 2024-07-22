import { Create, PasswordInput, SimpleForm } from 'react-admin';
import { SalesForm } from './SalesForm';
import { useIsAdmin } from './useIsAdmin';

export function SalesCreate() {
    const isAdmin = useIsAdmin();
    if (!isAdmin) {
        return null;
    }

    return (
        <Create>
            <SimpleForm>
                <SalesForm />
                <PasswordInput source="password" />
            </SimpleForm>
        </Create>
    );
}
