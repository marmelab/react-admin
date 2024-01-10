/* eslint react/jsx-key: off */
import * as React from 'react';
import PropTypes from 'prop-types';
import { Edit, Identifier, SimpleForm, TextInput, required } from 'react-admin';

const UserEditEmbedded = ({ id }: { id?: Identifier }) => (
    /* Passing " " as title disables the custom title */
    <Edit title=" " id={id}>
        <SimpleForm defaultValues={{ role: 'user' }}>
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
    resource: PropTypes.string,
    id: PropTypes.string,
};

export default UserEditEmbedded;
