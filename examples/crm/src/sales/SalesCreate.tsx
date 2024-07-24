import { Create, PasswordInput, required, SimpleForm } from 'react-admin';
import { SalesForm } from './SalesForm';

export function SalesCreate() {
    return (
        <Create redirect="list">
            <SimpleForm>
                <SalesForm />
                <PasswordInput source="password" validate={required()} />
            </SimpleForm>
        </Create>
    );
}
