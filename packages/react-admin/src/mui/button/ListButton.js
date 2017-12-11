import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ActionList from 'material-ui-icons/List';
import { withStyles } from 'material-ui/styles';

import Link from '../Link';
import translate from '../../i18n/translate';

const styles = {
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
    iconPaddingStyle: {
        paddingRight: '0.5em',
    },
};

const ListButton = ({
    basePath = '',
    classes = {},
    label = 'ra.action.list',
    translate,
}) => (
    <Button
        className={classes.link}
        component={Link}
        color="primary"
        to={basePath}
    >
        <ActionList className={classes.iconPaddingStyle} />
        {label && translate(label)}
    </Button>
);

ListButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(ListButton);
