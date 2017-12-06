import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ContentCreate from 'material-ui-icons/Create';
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

const EditButton = ({
    basePath = '',
    classes = {},
    label = 'ra.action.edit',
    record = {},
    translate,
}) => (
    <Button
        className={classes.link}
        component={Link}
        color="primary"
        to={linkToRecord(basePath, record.id)}
    >
        <ContentCreate className={classes.iconPaddingStyle} />
        {label && translate(label)}
    </Button>
);

EditButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    shouldUpdate(
        (props, nextProps) =>
            (props.record && props.record.id !== nextProps.record.id) ||
            props.basePath !== nextProps.basePath ||
            (props.record == null && nextProps.record != null)
    ),
    withStyles(styles),
    translate
);

export default enhance(EditButton);
