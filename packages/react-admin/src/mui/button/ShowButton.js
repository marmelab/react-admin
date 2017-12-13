import React from 'react';
import PropTypes from 'prop-types';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ImageEye from 'material-ui-icons/RemoveRedEye';
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

const ShowButton = ({
    basePath = '',
    classes = {},
    label = 'ra.action.show',
    record = {},
    translate,
}) => (
    <Button
        className={classes.link}
        component={Link}
        color="primary"
        style={{ overflow: 'inherit' }}
        to={`${linkToRecord(basePath, record.id)}/show`}
    >
        <ImageEye className={classes.iconPaddingStyle} />
        {label && translate(label)}
    </Button>
);

ShowButton.propTypes = {
    basePath: PropTypes.string,
    classes: PropTypes.object,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    translate,
    shouldUpdate(
        (props, nextProps) =>
            props.translate !== nextProps.translate ||
            (props.record && props.record.id !== nextProps.record.id) ||
            props.basePath !== nextProps.basePath ||
            (props.record == null && nextProps.record != null)
    ),
    withStyles(styles)
);

export default enhance(ShowButton);
