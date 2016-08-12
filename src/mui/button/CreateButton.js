import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const CreateButton = ({ basePath = '' }) => <FlatButton primary label="Create" icon={<ContentAdd />} containerElement={<Link to={`${basePath}/create`} />} style={{ overflow: 'inherit' }}/>;

CreateButton.propTypes = {
    basePath: PropTypes.string,
};

export default CreateButton;
