import React from 'react';
import CardActions from '@material-ui/core/CardActions';
import { DeleteButton, RefreshButton } from 'react-admin';
import AcceptButton from './AcceptButton';
import RejectButton from './RejectButton';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const ReviewEditActions = ({ basePath, data, hasShow, refresh, resource }) => (
    <CardActions style={cardActionStyle}>
        <AcceptButton record={data} />
        <RejectButton record={data} />
        <DeleteButton basePath={basePath} record={data} resource={resource} />
        <RefreshButton refresh={refresh} />
    </CardActions>
);

export default ReviewEditActions;
