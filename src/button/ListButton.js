import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';

const ListButton = ({ basePath }) => <FlatButton label="List" icon={<ActionList />} containerElement={<Link to={basePath} />} />;

ListButton.propTypes = {
    basePath: PropTypes.string.isRequired,
};

export default ListButton;
