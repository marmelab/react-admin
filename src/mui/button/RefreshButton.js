import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import translate from '../../i18n/translate';
import { refreshList as refreshListAction } from '../../actions/listActions';

const RefreshButton = ({ label = 'aor.action.refresh', translate, refresh, resource }) => <FlatButton
    primary
    label={label && translate(label)}
    onClick={() => refresh(resource)}
    icon={<NavigationRefresh />}
/>;

RefreshButton.propTypes = {
    label: PropTypes.string,
    refresh: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
};
const enhance = compose(
    connect(null, { refresh: refreshListAction }),
    translate,
);

export default enhance(RefreshButton);
