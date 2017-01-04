import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';

const ListButton = ({ basePath = '' }) => <FlatButton
    primary
    label="List"
    icon={<ActionList />}
    containerElement={<Link to={basePath} />}
    style={{ overflow: 'inherit' }}
/>;

ListButton.propTypes = {
    basePath: PropTypes.string,
};

export default ListButton;
