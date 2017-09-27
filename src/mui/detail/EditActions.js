import React from 'react';
import { CardActions } from 'material-ui/Card';
import { ListButton, ShowButton, DeleteButton, RefreshButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const EditActions = ({ basePath, data, hasDelete, hasShow, hasList }) => (
    <CardActions style={cardActionStyle}>
        {hasShow && <ShowButton basePath={basePath} record={data} />}
        {hasList && <ListButton basePath={basePath} />}
        {hasDelete && <DeleteButton basePath={basePath} record={data} />}
        <RefreshButton />
    </CardActions>
);

export default EditActions;
