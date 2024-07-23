import { Create, PasswordInput, required, SimpleForm } from 'react-admin';
import { SalesForm } from './SalesForm';

export function SalesCreate() {
    return (
        <Create>
            <SimpleForm>
                <SalesForm />
                <PasswordInput source="password" validate={required()} />
            </SimpleForm>
        </Create>
    );
}
