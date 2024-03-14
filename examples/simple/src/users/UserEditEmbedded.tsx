/* eslint react/jsx-key: off */
import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Edit,
    SimpleForm,
    TextInput,
    required,
    useRecordContext,
} from 'react-admin';

const UserEditEmbedded = () => {
    const record = useRecordContext();
    if (!record) return null;
    return (
        /* Passing " " as title disables the custom title */
        <Edit title=" " id={record.id} actions={false}>
            <SimpleForm defaultValues={{ role: 'user' }}>
                <TextInput
                    source="name"
                    defaultValue="slim shady"
                    validate={required()}
                />
            </SimpleForm>
        </Edit>
    );
};

UserEditEmbedded.propTypes = {
    record: PropTypes.object,
    resource: PropTypes.string,
    id: PropTypes.string,
};

export default UserEditEmbedded;
