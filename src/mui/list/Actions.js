import React, { PropTypes } from 'react';
import { CardActions } from 'material-ui/Card';
import { CreateButton, RefreshButton } from '../button';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const Actions = ({ resource, filters, displayedFilters, filterValues, hasCreate, basePath, showFilter, refresh }) => (
    <CardActions style={cardActionStyle}>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        {hasCreate && <CreateButton basePath={basePath} />}
        <RefreshButton onClick={refresh} />
    </CardActions>
);

export default Actions;
