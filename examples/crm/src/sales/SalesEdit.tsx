import {
    BooleanInput,
    DeleteWithConfirmButton,
    Edit,
    SaveButton,
    SimpleForm,
    Toolbar,
    useGetIdentity,
    useRecordContext,
} from 'react-admin';
import { Sale } from '../types';
import { SalesForm } from './SalesForm';
import { useIsAdmin } from './useIsAdmin';

function EditToolbar() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <SaveButton />

            <DeleteWithConfirmButton disabled={record?.id === identity?.id} />
        </Toolbar>
    );
}

export function SalesEdit() {
    const { identity } = useGetIdentity();
    const record = useRecordContext<Sale>();

    const isAdmin = useIsAdmin();
    if (!isAdmin) {
        return null;
    }

    return (
        <Edit>
            <SimpleForm toolbar={<EditToolbar />}>
                <SalesForm />

                <BooleanInput
                    source="administrator"
                    readOnly={record?.id === identity?.id}
                />
            </SimpleForm>
        </Edit>
    );
}
