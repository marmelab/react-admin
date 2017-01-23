import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import Translate from '../../i18n/Translate';

const RefreshButton = ({ label = 'aor.action.refresh', translate, refresh }) => <FlatButton
    primary
    label={translate(label)}
    onClick={refresh}
    icon={<NavigationRefresh />}
/>;

RefreshButton.propTypes = {
    label: PropTypes.string,
    refresh: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

export default Translate(RefreshButton);
