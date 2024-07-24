import {
    BooleanInput,
    required,
    TextInput,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';

export function SalesForm() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    return (
        <>
            <TextInput source="first_name" validate={required()} />
            <TextInput source="last_name" validate={required()} />
            <TextInput source="email" validate={required()} />

            <BooleanInput
                source="administrator"
                readOnly={record?.id === identity?.id}
            />
        </>
    );
}
