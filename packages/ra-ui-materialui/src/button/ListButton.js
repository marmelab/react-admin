import React from 'react';
import PropTypes from 'prop-types';
import ActionList from '@material-ui/icons/List';
import { Link } from 'react-router-dom';

import Button from './Button';

const ListButton = ({
    basePath = '',
    label = 'ra.action.list',
    icon,
    ...rest
}) => (
    <Button component={Link} to={basePath} label={label} {...rest}>
        {icon}
    </Button>
);

ListButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.element,
};

ListButton.defaultProps = {
    icon: <ActionList />,
};

export default ListButton;
