import React from 'react';
import PropTypes from 'prop-types';

import BulkActionSelectItem from './BulkActionSelectItem';

const SimpleListSelectItem = ({
    record,
    resource,
    selection,
    selectionMode,
}) => {
    const checked = selection.indexOf(record.id) !== -1;
    return (
        <BulkActionSelectItem
            resource={resource}
            selectionMode={selectionMode}
            ids={record.id}
            checked={checked}
        />
    );
};

SimpleListSelectItem.propTypes = {
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    resource: PropTypes.string,
    selection: PropTypes.array,
    selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']).isRequired,
};

export default SimpleListSelectItem;
