import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ActionDelete from 'material-ui-icons/Delete';
import { withStyles } from 'material-ui/styles';

import linkToRecord from '../../util/linkToRecord';
import translate from '../../i18n/translate';

const styles = {
    link: {
        display: 'inline-flex',
        alignItems: 'center',
    },
};

const DeleteButton = ({
    basePath = '',
    classes = {},
    label = 'ra.action.delete',
    record = {},
    translate,
}) => (
    <Button color="accent">
        <Link
            to={`${linkToRecord(basePath, record.id)}/delete`}
            className={classes.link}
        >
            <ActionDelete />
            &nbsp;
            {label && translate(label)}
        </Link>
    </Button>
);

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(withStyles(styles), translate);

export default enhance(DeleteButton);
