/* eslint react/jsx-key: off */
import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
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

const EditActions = ({
    basePath,
    data,
    hasShow,
}: {
    basePath?: string;
    data?: any;
    hasShow?: boolean;
}) => (
    <TopToolbar>
        <CloneButton
            className="button-clone"
            basePath={basePath}
            record={data}
        />
        <ShowButton basePath={basePath} record={data} />
    </TopToolbar>
);

const UserEditForm = ({
    permissions,
    save,
    ...props
}: {
    permissions?: any;
    save?: any;
}) => {
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
            defaultValue={{ role: 'user' }}
            toolbar={<UserEditToolbar />}
            {...props}
            save={newSave}
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
const UserEdit = ({ permissions, ...props }) => {
    return (
        <StyledEdit
            title={<UserTitle />}
            aside={<Aside />}
            actions={<EditActions />}
            {...props}
        >
            <UserEditForm permissions={permissions} />
        </StyledEdit>
    );
};

UserEdit.propTypes = {
    id: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserEdit;
