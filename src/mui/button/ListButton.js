import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import ActionList from 'material-ui/svg-icons/action/list';
import translate from '../../i18n/translate';

const ListButton = ({ basePath = '', label, translate }) => <FlatButton
    primary
    label={label || translate('aor.action.list')}
    icon={<ActionList />}
    containerElement={<Link to={basePath} />}
    style={{ overflow: 'inherit' }}
/>;

ListButton.propTypes = {
    basePath: PropTypes.string,
    label: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

export default translate(ListButton);
