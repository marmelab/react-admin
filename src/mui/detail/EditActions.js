import React from 'react';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { ListButton, ShowButton, DeleteButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const EditActions = ({ basePath, data, hasDelete, hasShow, refresh }) => (
    <CardActions style={cardActionStyle}>
        {hasShow && <ShowButton basePath={basePath} record={data} />}
        <ListButton basePath={basePath} />
        {hasDelete && <DeleteButton basePath={basePath} record={data} />}
        <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
    </CardActions>
);

export default EditActions;
