/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    Create,
    FormTab,
    SaveButton,
    AutocompleteInput,
    TabbedForm,
    TextInput,
    Toolbar,
    required,
    useNotify,
    usePermissions,
    useRedirect,
} from 'react-admin';

import Aside from './Aside';

const UserEditToolbar = ({ permissions, ...props }) => {
    const notify = useNotify();
    const redirect = useRedirect();

    return (
        <Toolbar {...props}>
            <SaveButton
                label="user.action.save_and_show"
                mutationOptions={{
                    onSuccess: data => {
                        notify('ra.notification.created', 'info', {
                            smart_count: 1,
                        });
                        redirect('show', data.id, data);
                    },
                }}
                submitOnEnter={true}
            />
            {permissions === 'admin' && (
                <SaveButton
                    label="user.action.save_and_add"
                    mutationOptions={{
                        onSuccess: data => {
                            notify('ra.notification.created', 'info', {
                                smart_count: 1,
                            });
                            redirect(false);
                        },
                    }}
                    submitOnEnter={false}
                    variant="text"
                />
            )}
        </Toolbar>
    );
};

const isValidName = async value =>
    new Promise<string>(resolve =>
        setTimeout(() =>
            resolve(value === 'Admin' ? "Can't be Admin" : undefined)
        )
    );

const UserCreate = () => {
    const { permissions } = usePermissions();
    return (
        <Create aside={<Aside />}>
            <TabbedForm toolbar={<UserEditToolbar permissions={permissions} />}>
                <FormTab label="user.form.summary" path="">
                    <TextInput
                        source="name"
                        defaultValue="Slim Shady"
                        autoFocus
                        validate={[required(), isValidName]}
                    />
                </FormTab>
                {permissions === 'admin' && (
                    <FormTab label="user.form.security" path="security">
                        <AutocompleteInput
                            source="role"
                            choices={[
                                { id: '', name: 'None' },
                                { id: 'admin', name: 'Admin' },
                                { id: 'user', name: 'User' },
                                { id: 'user_simple', name: 'UserSimple' },
                            ]}
                        />
                    </FormTab>
                )}
            </TabbedForm>
        </Create>
    );
};

export default UserCreate;
