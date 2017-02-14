import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import translate from '../../i18n/translate';

const RefreshButton = ({ label, translate, refresh }) => <FlatButton
    primary
    label={label || translate('aor.action.refresh')}
    onClick={refresh}
    icon={<NavigationRefresh />}
/>;

RefreshButton.propTypes = {
    label: PropTypes.string,
    refresh: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

export default translate(RefreshButton);
