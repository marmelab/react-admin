import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'material-ui/Card';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import { CreateButton, RefreshButton } from '../button';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const cardActionStyle = {
    zIndex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
};

const Actions = ({ resource, filters, displayedFilters, filterValues, theme, hasCreate, basePath, showFilter, refresh }) => {
    const muiTheme = getMuiTheme(theme);
    const prefix = autoprefixer(muiTheme);

    return (
        <CardActions style={prefix(cardActionStyle)}>
            {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
            {hasCreate && <CreateButton basePath={basePath} />}
            <RefreshButton refresh={refresh} />
        </CardActions>
    );
};

export default onlyUpdateForKeys(['resource', 'filters', 'displayedFilters', 'filterValues', 'theme'])(Actions);
