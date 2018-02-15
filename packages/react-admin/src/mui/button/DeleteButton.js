import React from 'react';
import PropTypes from 'prop-types';
import ActionDelete from 'material-ui-icons/Delete';
import { linkToRecord } from 'react-admin-core';

import Link from '../Link';
import Button from './Button';

const DeleteButton = ({
    basePath = '',
    label = 'ra.action.delete',
    record = {},
    ...rest
}) => (
    <Button
        component={Link}
        to={`${linkToRecord(basePath, record.id)}/delete`}
        label={label}
        color="secondary"
        {...rest}
    >
        <ActionDelete />
    </Button>
);

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
};

export default DeleteButton;
