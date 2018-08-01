import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ContentAdd from '@material-ui/icons/Add';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { translate } from 'ra-core';

import Responsive from '../layout/Responsive';

const styles = theme => ({
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
    desktopLink: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    label: {
        paddingLeft: '0.5em',
    },
});

const CreateButton = ({
    basePath = '',
    className,
    classes = {},
    translate,
    label = 'ra.action.create',
    size = 'small',
    ...rest
}) => (
    <Responsive
        small={
            <Button
                component={Link}
                variant="fab"
                color="primary"
                className={classnames(classes.floating, className)}
                to={`${basePath}/create`}
                {...rest}
            >
                <ContentAdd />
            </Button>
        }
        medium={
            <Button
                component={Link}
                color="primary"
                to={`${basePath}/create`}
                className={classnames(classes.desktopLink, className)}
                size={size}
                {...rest}
            >
                <ContentAdd className={classes.iconPaddingStyle} />
                <span className={classes.label}>
                    {label && translate(label)}
                </span>
            </Button>
        }
    />
);

CreateButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    size: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    translate,
    onlyUpdateForKeys(['basePath', 'label']),
    withStyles(styles)
);

export default enhance(CreateButton);
