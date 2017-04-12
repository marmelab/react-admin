import React from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import translate from '../../i18n/translate';

const RefreshButton = ({ label = 'aor.action.refresh', translate, refresh }) => <FlatButton
    primary
    label={label && translate(label)}
    onClick={refresh}
    icon={<NavigationRefresh />}
/>;

RefreshButton.propTypes = {
    label: PropTypes.string,
    refresh: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
};

export default translate(RefreshButton);
