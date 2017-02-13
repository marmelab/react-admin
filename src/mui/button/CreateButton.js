import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import FlatButton from 'material-ui/FlatButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import translate from '../../i18n/translate';

const CreateButton = ({ basePath = '', translate, label = 'aor.action.create' }) => <FlatButton
    primary
    label={label && translate(label)}
    icon={<ContentAdd />}
    containerElement={<Link to={`${basePath}/create`} />}
    style={{ overflow: 'inherit' }}
/>;

CreateButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

export default translate(onlyUpdateForKeys(['basePath, label'])(CreateButton));
