import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import Button from 'material-ui/Button';
import ContentCreate from 'material-ui-icons/Create';
import linkToRecord from '../../util/linkToRecord';
import translate from '../../i18n/translate';

const EditButton = ({
    basePath = '',
    label = 'ra.action.edit',
    record = {},
    translate,
}) => (
    <Button color="primary" style={{ overflow: 'inherit' }}>
        <Link to={linkToRecord(basePath, record.id)}>
            <ContentCreate />
            {label && translate(label)}
        </Link>
    </Button>
);

EditButton.propTypes = {
    basePath: PropTypes.string,
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
    translate
);

export default enhance(EditButton);
