import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';

const DeleteButton = ({ basePath, record = {} }) => <FlatButton label="Delete" containerElement={<Link to={`${basePath}/${record.id}/delete`} />} icon={<ActionDelete />} />;

DeleteButton.propTypes = {
    basePath: PropTypes.string.isRequired,
    record: PropTypes.object,
};

export default DeleteButton;
