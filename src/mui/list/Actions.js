import React from 'react';
import PropTypes from 'prop-types';
import { CardActions } from 'material-ui/Card';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import autoprefixer from 'material-ui/utils/autoprefixer';
import { CreateButton, RefreshButton, BulkDeleteButton } from '../button';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const cardActionStyle = {
    zIndex: 2,
    display: 'flex',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
};

const Actions = ({
    resource,
    filters,
    displayedFilters,
    filterValues,
    theme,
    hasCreate,
    basePath,
    showFilter,
    refresh,
}) => {
    const muiTheme = getMuiTheme(theme);
    const prefix = autoprefixer(muiTheme);

    return (
        <CardActions style={prefix(cardActionStyle)}>
            {filters &&
                React.cloneElement(filters, {
                    resource,
                    showFilter,
                    displayedFilters,
                    filterValues,
                    context: 'button',
                })}
            {hasCreate && <CreateButton basePath={basePath} />}
            <RefreshButton refresh={refresh} />
            <BulkDeleteButton resource={resource} />
        </CardActions>
    );
};

Actions.propTypes = {
    basePath: PropTypes.string,
    displayedFilters: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    refresh: PropTypes.func,
    resource: PropTypes.string,
    showFilter: PropTypes.func,
    theme: PropTypes.object,
};

export default onlyUpdateForKeys([
    'resource',
    'filters',
    'displayedFilters',
    'filterValues',
    'theme',
])(Actions);
