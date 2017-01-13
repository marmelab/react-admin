import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import linkToRecord from '../../util/linkToRecord'

const EditButton = ({ basePath = '', record = {} }) => <FlatButton
    primary
    label="Edit"
    icon={<ContentCreate />}
    containerElement={<Link to={linkToRecord(basePath, record.id)} />}
    style={{ overflow: 'inherit' }}
/>;

EditButton.propTypes = {
    basePath: PropTypes.string,
    record: PropTypes.object,
};

export default EditButton;
