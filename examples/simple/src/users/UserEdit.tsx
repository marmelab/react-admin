/* eslint react/jsx-key: off */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    CloneButton,
    DeleteWithConfirmButton,
    Edit,
    FormTab,
    required,
    SaveButton,
    SelectInput,
    ShowButton,
    TabbedForm,
    TextInput,
    Toolbar,
    TopToolbar,
    usePermissions,
} from 'react-admin';

import UserTitle from './UserTitle';
import Aside from './Aside';

const PREFIX = 'UserEdit';

const classes = {
    toolbar: `${PREFIX}-toolbar`,
};

const StyledEdit = styled(Edit)({
    [`& .${classes.toolbar}`]: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

const StyledToolbar = styled(Toolbar)({
    [`& .RaToolbar-toolbar`]: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});

/**
 * Custom Toolbar for the Edit form
 *
 * Save with undo, but delete with confirm
 */
const UserEditToolbar = props => {
    return (
        <StyledToolbar {...props}>
            <SaveButton />
            <DeleteWithConfirmButton />
        </StyledToolbar>
    );
};

const EditActions = () => (
    <TopToolbar>
        <CloneButton className="button-clone" />
        <ShowButton />
    </TopToolbar>
);

const UserEditForm = ({ save, ...props }: { save?: any }) => {
    const { permissions } = usePermissions();
    const newSave = values =>
        new Promise((resolve, reject) => {
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
            {...props}
            onSubmit={newSave}
        >
            <FormTab label="user.form.summary" path="">
                {permissions === 'admin' && <TextInput disabled source="id" />}
                <TextInput
                    source="name"
                    defaultValue="slim shady"
                    validate={required()}
                />
            </FormTab>
            {permissions === 'admin' && (
                <FormTab label="user.form.security" path="security">
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
                </FormTab>
            )}
        </TabbedForm>
    );
};
const UserEdit = () => {
    return (
        <StyledEdit
            title={<UserTitle />}
            aside={<Aside />}
            actions={<EditActions />}
        >
            <UserEditForm />
        </StyledEdit>
    );
};

export default UserEdit;
