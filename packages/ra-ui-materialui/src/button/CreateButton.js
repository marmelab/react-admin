import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Fab from '@material-ui/core/Fab';
import { withStyles, createStyles } from '@material-ui/core/styles';
import ContentAdd from '@material-ui/icons/Add';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { useTranslate } from 'ra-core';

import Button from './Button';
import { useMediaIsSmall } from '../layout/mediaQueries';

const styles = theme =>
    createStyles({
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
    });

const CreateButton = ({
    basePath = '',
    className,
    classes = {},
    label = 'ra.action.create',
    icon = <ContentAdd />,
    ...rest
}) => {
    const translate = useTranslate();
    const isSmall = useMediaIsSmall();
    return isSmall ? (
        <Fab
            component={Link}
            color="primary"
            className={classnames(classes.floating, className)}
            to={`${basePath}/create`}
            aria-label={label && translate(label)}
            {...rest}
        >
            {icon}
        </Fab>
    ) : (
        <Button
            component={Link}
            to={`${basePath}/create`}
            className={className}
            label={label}
            {...rest}
        >
            {icon}
        </Button>
    );
};

CreateButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    size: PropTypes.string,
    icon: PropTypes.element,
};

const enhance = compose(
    onlyUpdateForKeys(['basePath', 'label', 'translate']),
    withStyles(styles)
);

export default enhance(CreateButton);
