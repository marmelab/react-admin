import {
    BooleanInput,
    required,
    TextInput,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';
import { ReactNode } from 'react';
import { Stack } from '@mui/material';

export function SalesInputs({ children }: { children: ReactNode }) {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    return (
        <Stack gap={1} sx={{ width: '100%' }}>
            <TextInput
                source="first_name"
                validate={required()}
                helperText={false}
            />
            <TextInput
                source="last_name"
                validate={required()}
                helperText={false}
            />
            <TextInput
                source="email"
                validate={required()}
                helperText={false}
            />
            {children}
            <BooleanInput
                source="administrator"
                readOnly={record?.id === identity?.id}
                helperText={false}
            />
        </Stack>
    );
}
