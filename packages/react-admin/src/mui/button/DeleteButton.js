import React from 'react';
import PropTypes from 'prop-types';
import ActionDelete from 'material-ui-icons/Delete';

import Link from '../Link';
import linkToRecord from '../../util/linkToRecord';
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
        color="accent"
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
