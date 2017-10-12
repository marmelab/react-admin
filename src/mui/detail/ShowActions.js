import React from 'react';
import { CardActions } from 'material-ui/Card';
import { ListButton, EditButton, DeleteButton, RefreshButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const ShowActions = ({ basePath, data, hasDelete, hasEdit, hasList }) => (
    <CardActions style={cardActionStyle}>
        {hasEdit && <EditButton basePath={basePath} record={data} />}
        {hasList && <ListButton basePath={basePath} />}
        {hasDelete && <DeleteButton basePath={basePath} record={data} />}
        <RefreshButton />
    </CardActions>
);

export default ShowActions;
