import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'material-ui/Card';
import { CreateButton, RefreshButton } from '../button';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const Actions = ({ resource, filters, displayedFilters, filterValues, hasCreate, basePath, showFilter, refresh }) => (
    <CardActions style={cardActionStyle}>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        {hasCreate && <CreateButton basePath={basePath} />}
        <RefreshButton refresh={refresh} />
    </CardActions>
);

export default onlyUpdateForKeys(['resource', 'filters', 'displayedFilters', 'filterValues'])(Actions);
