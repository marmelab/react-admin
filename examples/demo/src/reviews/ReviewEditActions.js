import React from 'react';
import { CardActions } from 'react-admin';

import AcceptButton from './AcceptButton';
import RejectButton from './RejectButton';

const ReviewEditActions = ({ data }) => (
    <CardActions>
        <AcceptButton record={data} />
        <RejectButton record={data} />
    </CardActions>
);

export default ReviewEditActions;
