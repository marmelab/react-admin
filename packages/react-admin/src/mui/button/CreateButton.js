import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import Button from 'material-ui/Button';
import ContentAdd from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import classnames from 'classnames';

import Responsive from '../layout/Responsive';
import Link from '../Link';
import translate from '../../i18n/translate';

const styles = {
    floating: {
        margin: 0,
        top: 'auto',
        right: 20,
        bottom: 60,
        left: 'auto',
        position: 'fixed',
    },
    floatingLink: {
        color: 'inherit',
    },
    desktopLink: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
};

const CreateButton = ({
    basePath = '',
    className,
    classes = {},
    translate,
    label = 'ra.action.create',
}) => (
    <Responsive
        small={
            <Button
                component={Link}
                fab
                color="primary"
                className={classnames(classes.floating, className)}
                to={`${basePath}/create`}
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
            >
                <ContentAdd className={classes.iconPaddingStyle} />
                {label && translate(label)}
            </Button>
        }
    />
);

CreateButton.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    onlyUpdateForKeys(['basePath', 'label']),
    withStyles(styles),
    translate
);

export default enhance(CreateButton);
