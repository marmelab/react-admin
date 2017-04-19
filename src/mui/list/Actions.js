import React, { PropTypes } from 'react';
import { CardActions } from 'material-ui/Card';
import { CreateButton, RefreshButton } from '../button';
import HideFieldsButton from './HideFieldsButton';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const Actions = ({
                     resource,
                     filters,
                     displayedFilters,
                     filterValues,
                     hasCreate,
                     basePath,
                     showFilter,
                     refresh,
                     handleFieldVisibility,
                     fields,
                     hiddenFields,
}) => (
    <CardActions style={cardActionStyle}>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        {hasCreate && <CreateButton basePath={basePath} />}
        <HideFieldsButton fields={fields} handleFieldVisibility={handleFieldVisibility} hiddenFields={hiddenFields} />
        <RefreshButton refresh={refresh} />
    </CardActions>
);

export default onlyUpdateForKeys(['resource', 'filters', 'displayedFilters', 'filterValues'])(Actions);
