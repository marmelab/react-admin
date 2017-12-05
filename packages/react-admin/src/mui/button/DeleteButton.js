import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ActionDelete from 'material-ui-icons/Delete';
import { withStyles } from 'material-ui/styles';

import Link from '../Link';
import linkToRecord from '../../util/linkToRecord';
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

const DeleteButton = ({
    basePath = '',
    classes = {},
    label = 'ra.action.delete',
    record = {},
    translate,
}) => (
    <Button
        component={Link}
        color="accent"
        to={`${linkToRecord(basePath, record.id)}/delete`}
    >
        <ActionDelete className={classes.iconPaddingStyle} />
        {label && translate(label)}
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
