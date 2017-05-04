import React from 'react';
import { CardActions } from 'material-ui/Card';
import { ListButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const CreateActions = ({ basePath }) => (
    <CardActions style={cardActionStyle}>
        <ListButton basePath={basePath} />
    </CardActions>
);

export default CreateActions;
