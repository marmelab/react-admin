import React from 'react';
import CardActions from '@material-ui/core/CardActions';
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
    </CardActions>
);

export default ReviewEditActions;
