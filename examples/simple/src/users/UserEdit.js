/* eslint react/jsx-key: off */
import * as React from 'react';
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
import { makeStyles } from '@material-ui/core/styles';

import UserTitle from './UserTitle';
import Aside from './Aside';

const useToolbarStyles = makeStyles({
    toolbar: {
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
    const classes = useToolbarStyles();
    return (
        <Toolbar {...props} classes={classes}>
            <SaveButton />
            <DeleteWithConfirmButton />
        </Toolbar>
    );
};

const EditActions = ({ basePath, data, hasShow }) => (
    <TopToolbar>
        <CloneButton
            className="button-clone"
            basePath={basePath}
            record={data}
        />
        <ShowButton basePath={basePath} record={data} />
    </TopToolbar>
);

const UserEdit = ({ permissions, ...props }) => (
    <Edit
        title={<UserTitle />}
        aside={<Aside />}
        actions={<EditActions />}
        {...props}
    >
        <TabbedForm
            defaultValue={{ role: 'user' }}
            toolbar={<UserEditToolbar />}
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
    </Edit>
);

UserEdit.propTypes = {
    id: PropTypes.any.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    permissions: PropTypes.string,
};

export default UserEdit;
