/* eslint react/jsx-key: off */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Edit, SimpleForm, TextInput, required } from 'react-admin';

const UserEditEmbedded = props => (
    /* Passing " " as title disables the custom title */
    <Edit title=" " {...props}>
        <SimpleForm initialValues={{ role: 'user' }}>
            <TextInput
                source="name"
                defaultValue="slim shady"
                validate={required()}
            />
        </SimpleForm>
    </Edit>
);

UserEditEmbedded.propTypes = {
    record: PropTypes.object,
    basePath: PropTypes.string,
    resource: PropTypes.string,
    id: PropTypes.string,
};

export default UserEditEmbedded;
