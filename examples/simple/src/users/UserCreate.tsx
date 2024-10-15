/* eslint react/jsx-key: off */
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import {
    Create,
    SaveButton,
    AutocompleteInput,
    TabbedForm,
    TextInput,
    Toolbar,
    required,
    useNotify,
    useUnique,
    CanAccess,
    useCanAccess,
} from 'react-admin';

import Aside from './Aside';

const UserCreateToolbar = () => {
    const notify = useNotify();
    const { reset } = useFormContext();

    return (
        <Toolbar>
            <SaveButton label="user.action.save_and_show" />
            <CanAccess action="save_and_add">
                <SaveButton
                    label="user.action.save_and_add"
                    mutationOptions={{
                        onSuccess: () => {
                            notify('resources.users.notifications.created', {
                                type: 'info',
                                messageArgs: {
                                    smart_count: 1,
                                },
                            });
                            reset();
                        },
                    }}
                    type="button"
                    variant="text"
                />
            </CanAccess>
        </Toolbar>
    );
};

const isValidName = async value =>
    new Promise<string | undefined>(resolve =>
        setTimeout(() =>
            resolve(value === 'Admin' ? "Can't be Admin" : undefined)
        )
    );

const UserCreate = () => {
    const unique = useUnique();
    const { isPending, canAccess: canEditRole } = useCanAccess({
        action: 'edit',
        resource: 'users.role',
    });
    if (isPending) {
        return null;
    }
    return (
        <Create aside={<Aside />} redirect="show">
            <TabbedForm
                mode="onBlur"
                warnWhenUnsavedChanges
                toolbar={<UserCreateToolbar />}
            >
                <TabbedForm.Tab label="user.form.summary" path="">
                    <TextInput
                        source="name"
                        defaultValue="Slim Shady"
                        autoFocus
                        validate={[required(), isValidName, unique()]}
                    />
                </TabbedForm.Tab>
                {canEditRole ? (
                    <TabbedForm.Tab label="user.form.security" path="security">
                        <AutocompleteInput
                            source="role"
                            choices={[
                                { id: '', name: 'None' },
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' },
                                { id: 'user_simple', name: 'UserSimple' },
                            ]}
                            validate={[required()]}
                        />
                    </TabbedForm.Tab>
                ) : null}
            </TabbedForm>
        </Create>
    );
};

export default UserCreate;
