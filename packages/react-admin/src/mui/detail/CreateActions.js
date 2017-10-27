import React from 'react';
import { CardActions } from 'material-ui/Card';
import { ListButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
};

const CreateActions = ({ basePath, hasList }) => (
    <CardActions style={cardActionStyle}>
        {hasList && <ListButton basePath={basePath} />}
    </CardActions>
);

export default CreateActions;
