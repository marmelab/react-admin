import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ActionList from 'material-ui-icons/List';
import { withStyles } from 'material-ui/styles';

import translate from '../../i18n/translate';

const styles = {
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
};

const ListButton = ({
    basePath = '',
    classes = {},
    label = 'ra.action.list',
    translate,
}) => (
    <Button color="primary">
        <Link to={basePath} className={classes.link}>
            <ActionList />
            &nbsp;
            {label && translate(label)}
        </Link>
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
