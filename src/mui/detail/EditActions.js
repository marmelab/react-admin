import React, { PropTypes } from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { ListButton, ShowButton, DeleteButton } from '../button';
import LocalizedComponent from '../../i18n/LocalizedComponent';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const EditActions = ({ basePath, data, hasDelete, hasShow, refresh, translate }) => (
    <CardActions style={cardActionStyle}>
        {hasShow && <ShowButton basePath={basePath} record={data} />}
        <ListButton basePath={basePath} />
        {hasDelete && <DeleteButton basePath={basePath} record={data} />}
        <FlatButton primary label={translate('aor.action.refresh')} onClick={refresh} icon={<NavigationRefresh />} />
    </CardActions>
);

EditActions.propTypes = {
    translate: PropTypes.func.isRequired,
};

export default LocalizedComponent(EditActions);
