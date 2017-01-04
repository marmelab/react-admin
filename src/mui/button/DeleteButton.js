import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import linkToRecord from '../../util/linkToRecord'

const DeleteButton = ({ basePath = '', record = {} }) => <FlatButton
    secondary
    label="Delete"
    icon={<ActionDelete />}
    containerElement={<Link to={`${linkToRecord(basePath, record.id)}/delete`} />}
    style={{ overflow: 'inherit' }}
/>;

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    record: PropTypes.object,
};

export default DeleteButton;
