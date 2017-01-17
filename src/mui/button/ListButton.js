import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';
import LocalizedComponent from '../../i18n/LocalizedComponent';

const ListButton = ({ basePath = '', label = 'aor.action.list', translate }) => <FlatButton
    primary
    label={translate(label)}
    icon={<ActionList />}
    containerElement={<Link to={basePath} />}
    style={{ overflow: 'inherit' }}
/>;

ListButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

export default LocalizedComponent(ListButton);
