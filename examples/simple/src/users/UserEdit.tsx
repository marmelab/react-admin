/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    CanAccess,
    CloneButton,
    DeleteWithConfirmButton,
    Edit,
    required,
    SaveButton,
    SelectInput,
    ShowButton,
    TabbedForm,
    TextInput,
    Toolbar,
    TopToolbar,
    useCanAccess,
    useSaveContext,
} from 'react-admin';

import Aside from './Aside';

/**
 * Custom Toolbar for the Edit form
 *
 * Save with undo, but delete with confirm
 */
const UserEditToolbar = props => {
    return (
        <Toolbar
            sx={{ display: 'flex', justifyContent: 'space-between' }}
            {...props}
        >
            <SaveButton />
            <DeleteWithConfirmButton />
        </Toolbar>
    );
};

const EditActions = () => (
    <TopToolbar>
        <CloneButton className="button-clone" />
        <ShowButton />
    </TopToolbar>
);

const UserEditForm = () => {
    const { isPending, canAccess: canEditRole } = useCanAccess({
        action: 'edit',
        resource: 'users.role',
    });
    const { save } = useSaveContext();
    if (isPending) {
        return null;
    }
    if (!save) return null;

    const newSave = values =>
        new Promise(resolve => {
            if (values.name === 'test') {
                return resolve({
                    name: {
                        message: 'ra.validation.minLength',
                        args: { min: 10 },
                    },
                });
            }
            return save(values);
        });

    return (
        <TabbedForm
            defaultValues={{ role: 'user' }}
            toolbar={<UserEditToolbar />}
            onSubmit={newSave}
        >
            <TabbedForm.Tab label="user.form.summary" path="">
                <CanAccess action="show" resource="users.id">
                    <TextInput source="id" InputProps={{ disabled: true }} />
                </CanAccess>
                <TextInput
                    source="name"
                    defaultValue="slim shady"
                    validate={required()}
                />
            </TabbedForm.Tab>
            {canEditRole ? (
                <TabbedForm.Tab label="user.form.security" path="security">
                    <SelectInput
                        source="role"
                        validate={required()}
                        choices={[
                            { id: '', name: 'None' },
                            { id: 'admin', name: 'Admin' },
                            { id: 'user', name: 'User' },
                        ]}
                        defaultValue={'user'}
                    />
                </TabbedForm.Tab>
            ) : null}
        </TabbedForm>
    );
};
const UserEdit = () => {
    return (
        <Edit aside={<Aside />} actions={<EditActions />}>
            <UserEditForm />
        </Edit>
    );
};

export default UserEdit;
