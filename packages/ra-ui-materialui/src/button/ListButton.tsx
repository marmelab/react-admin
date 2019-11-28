import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import ActionList from '@material-ui/icons/List';
import { Link } from 'react-router-dom';

import Button, { ButtonProps } from './Button';

const ListButton: FC<ListButtonProps> = ({
    basePath = '',
    label = 'ra.action.list',
    icon = defaultIcon,
    ...rest
}) => (
    <Button component={Link} to={basePath} label={label} {...rest as any}>
        {icon}
    </Button>
);

const defaultIcon = <ActionList />;

interface Props {
    basePath?: string;
    icon?: ReactElement;
}

export type ListButtonProps = Props & ButtonProps;

ListButton.propTypes = {
    basePath: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
};

export default ListButton;
