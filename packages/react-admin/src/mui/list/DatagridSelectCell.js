import React from 'react';
import PropTypes from 'prop-types';
import { TableCell } from 'material-ui/Table';

import BulkActionSelectItem from './BulkActionSelectItem';

const DataGridSelectCell = ({
    record,
    resource,
    selection,
    selectionMode,
    ...rest
}) => {
    const checked = selection.indexOf(record.id) !== -1;
    return (
        <TableCell {...rest}>
            <BulkActionSelectItem
                resource={resource}
                selectionMode={selectionMode}
                ids={record.id}
                checked={checked}
            />
        </TableCell>
    );
};

DataGridSelectCell.propTypes = {
    record: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    resource: PropTypes.string,
    selection: PropTypes.array,
    selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']).isRequired,
};

export default DataGridSelectCell;
