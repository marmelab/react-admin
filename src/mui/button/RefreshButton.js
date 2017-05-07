import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import translate from '../../i18n/translate';
import { refreshList as refreshListAction } from '../../actions/listActions';

const RefreshButton = ({ label, translate, onClick }) => <FlatButton
    primary
    label={label && translate(label)}
    onClick={onClick}
    icon={<NavigationRefresh />}
/>;

RefreshButton.defaultProps = {
    label: 'aor.action.refresh',
};

RefreshButton.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    translate: PropTypes.func.isRequired,
    resource: PropTypes.string.isRequired,
};
const enhance = compose(
    connect(null, { refresh: refreshListAction }),
    withHandlers({
        onClick: props => (event) => {
            event.preventDefault();
            props.refresh(props.resource);
        },
    }),
    translate,
);

export default enhance(RefreshButton);
