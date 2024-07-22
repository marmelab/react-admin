import { TextInput } from 'react-admin';

export function SalesForm() {
    return (
        <>
            <TextInput source="first_name" />
            <TextInput source="last_name" />
            <TextInput source="email" />
        </>
    );
}
