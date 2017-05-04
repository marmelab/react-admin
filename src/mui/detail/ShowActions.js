import React from 'react';
import { CardActions } from 'material-ui/Card';
import { ListButton, EditButton, DeleteButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const ShowActions = ({ basePath, data, hasDelete, hasEdit, refresh }) => (
    <CardActions style={cardActionStyle}>
        {hasEdit && <EditButton basePath={basePath} record={data} />}
        <ListButton basePath={basePath} />
        {hasDelete && <DeleteButton basePath={basePath} record={data} />}
    </CardActions>
);

export default ShowActions;
