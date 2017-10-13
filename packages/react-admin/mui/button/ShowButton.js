import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import ImageEye from 'material-ui/svg-icons/image/remove-red-eye';
import linkToRecord from '../../util/linkToRecord';
import translate from '../../i18n/translate';

const ShowButton = ({
    basePath = '',
    label = 'aor.action.show',
    record = {},
    translate,
}) => (
    <FlatButton
        primary
        label={label && translate(label)}
        icon={<ImageEye />}
        containerElement={
            <Link to={`${linkToRecord(basePath, record.id)}/show`} />
        }
        style={{ overflow: 'inherit' }}
    />
);

ShowButton.propTypes = {
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

export default enhance(ShowButton);
