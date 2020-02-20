import React, { FC, ReactElement } from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import { Fab, makeStyles, useMediaQuery, Theme } from '@material-ui/core';
import ContentAdd from '@material-ui/icons/Add';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslate } from 'ra-core';

import Button, { ButtonProps } from './Button';

const CreateButton: FC<CreateButtonProps> = ({
    basePath = '',
    className,
    classes: classesOverride,
    label = 'ra.action.create',
    icon = defaultIcon,
    ...rest
}) => {
    const classes = useStyles({ classes: classesOverride });
    const translate = useTranslate();
    const isSmall = useMediaQuery((theme: Theme) =>
        theme.breakpoints.down('sm')
    );
    return isSmall ? (
        <Fab
            component={Link}
            color="primary"
            className={classnames(classes.floating, className)}
            to={`${basePath}/create`}
            aria-label={label && translate(label)}
            {...rest as any}
        >
            {icon}
        </Fab>
    ) : (
        <Button
            component={Link}
            to={`${basePath}/create`}
            className={className}
            label={label}
            {...rest as any}
        >
            {icon}
        </Button>
    );
};

const defaultIcon = <ContentAdd />;

const useStyles = makeStyles(
    theme => ({
        floating: {
            color: theme.palette.getContrastText(theme.palette.primary.main),
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 60,
            left: 'auto',
            position: 'fixed',
            zIndex: 1000,
        },
        floatingLink: {
            color: 'inherit',
        },
    }),
    { name: 'RaCreateButton' }
);

interface Props {
    basePath?: string;
    icon?: ReactElement;
}

export type CreateButtonProps = Props & ButtonProps;

CreateButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    className: PropTypes.string,
    icon: PropTypes.element,
    label: PropTypes.string,
};

const enhance = onlyUpdateForKeys(['basePath', 'label', 'translate']);
export default enhance(CreateButton);
