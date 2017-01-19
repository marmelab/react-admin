import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shouldUpdate from 'recompose/shouldUpdate';
import FlatButton from 'material-ui/FlatButton';
import ContentCreate from 'material-ui/svg-icons/content/create';
import linkToRecord from '../../util/linkToRecord';
import Translate from '../../i18n/Translate';

const EditButton = ({ basePath = '', label = 'aor.action.edit', record = {}, translate }) => <FlatButton
    primary
    label={translate(label)}
    icon={<ContentCreate />}
    containerElement={<Link to={linkToRecord(basePath, record.id)} />}
    style={{ overflow: 'inherit' }}
/>;

EditButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

export default Translate(shouldUpdate((props, nextProps) =>
    props.record.id !== nextProps.record.id
    || props.basePath !== nextProps.basePath
)(EditButton));
