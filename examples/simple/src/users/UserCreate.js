/* eslint react/jsx-key: off */
import React from 'react';
import {
    Create,
    FormTab,
    SaveButton,
    AutocompleteInput,
    TabbedForm,
    TextInput,
    Toolbar,
    required,
} from 'react-admin';

import Aside from './Aside';

const UserEditToolbar = ({ permissions, ...props }) => (
    <Toolbar {...props}>
        <SaveButton
            label="user.action.save_and_show"
            redirect="show"
            submitOnEnter={true}
        />
        {permissions === 'admin' && (
            <SaveButton
                label="user.action.save_and_add"
                redirect={false}
                submitOnEnter={false}
                variant="flat"
            />
        )}
    </Toolbar>
);

const UserCreate = ({ permissions, ...props }) => (
    <Create {...props} aside={<Aside />}>
        <TabbedForm toolbar={<UserEditToolbar permissions={permissions} />}>
            <FormTab label="user.form.summary" path="">
                <TextInput
                    source="name"
                    defaultValue="Slim Shady"
                    validate={required()}
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

export default UserCreate;
