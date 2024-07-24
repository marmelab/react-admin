import {
    DeleteWithConfirmButton,
    Edit,
    PasswordInput,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';
import { SalesForm } from './SalesForm';

function EditToolbar() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />

            <DeleteWithConfirmButton
                disabled={record?.id === identity?.id}
                mutationOptions={{
                    meta: {
                        identity,
                    },
                }}
            />
        </Toolbar>
    );
}

export function SalesEdit() {
    return (
        <>
            <Edit>
                <SimpleForm toolbar={<EditToolbar />}>
                    <SalesForm />

                    <PasswordInput source="new_password" />
                </SimpleForm>
            </Edit>
        </>
    );
}
