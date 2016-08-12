import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';

const EditButton = ({ basePath = '', record = {} }) => <FlatButton primary label="Edit" containerElement={<Link to={`${basePath}/${record.id}`} />} icon={<ContentCreate />} />;

EditButton.propTypes = {
    basePath: PropTypes.string,
    record: PropTypes.object,
};

export default EditButton;
