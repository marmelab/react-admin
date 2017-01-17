import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import linkToRecord from '../../util/linkToRecord';
import LocalizedComponent from '../../i18n/LocalizedComponent';

const DeleteButton = ({ basePath = '', label = 'aor.action.delete', record = {}, translate }) => <FlatButton
    secondary
    label={translate(label)}
    icon={<ActionDelete />}
    containerElement={<Link to={`${linkToRecord(basePath, record.id)}/delete`} />}
    style={{ overflow: 'inherit' }}
/>;

DeleteButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
};

export default LocalizedComponent(DeleteButton);
