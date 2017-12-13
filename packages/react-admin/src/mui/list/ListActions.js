import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import { CreateButton, RefreshButton } from '../button';
import CardActions from '../layout/CardActions';

const Actions = ({
    className,
    resource,
    filters,
    displayedFilters,
    filterValues,
    hasCreate,
    basePath,
    showFilter,
}) => {
    return (
        <CardActions className={className}>
            {filters &&
                React.cloneElement(filters, {
                    resource,
                    showFilter,
                    displayedFilters,
                    filterValues,
                    context: 'button',
                })}
            {hasCreate && <CreateButton basePath={basePath} />}
            <RefreshButton />
        </CardActions>
    );
};

Actions.propTypes = {
    basePath: PropTypes.string,
    className: PropTypes.string,
    displayedFilters: PropTypes.object,
    filters: PropTypes.element,
    filterValues: PropTypes.object,
    hasCreate: PropTypes.bool,
    resource: PropTypes.string,
    showFilter: PropTypes.func,
};

export default onlyUpdateForKeys([
    'resource',
    'filters',
    'displayedFilters',
    'filterValues',
])(Actions);
