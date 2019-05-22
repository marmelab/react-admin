import React from 'react';
import PropTypes from 'prop-types';
import ActionList from '@material-ui/icons/List';
import { Link } from 'react-router-dom';
import { ComponentPropType } from 'ra-core';

import Button from './Button';

const ListButton = ({
    basePath = '',
    label = 'ra.action.list',
    icon: Icon = ActionList,
    ...rest
}) => (
    <Button component={Link} to={basePath} label={label} {...rest}>
        <Icon />
    </Button>
);

ListButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    icon: ComponentPropType,
};

export default ListButton;
