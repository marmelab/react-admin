import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import BulkActionSelectItem from './BulkActionSelectItem';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import { TableCell } from 'material-ui/Table';

const styles = {
    selected: {},
    selectAll: {},
};

export const DatagridHeaderSelectCell = ({
    classes,
    className,
    ids: pageIds,
    selection,
    selectionMode,
    resource,
    ...rest
}) => {
    const checked =
        pageIds.length > 0 && !pageIds.find(id => selection.indexOf(id) === -1);
    return (
        <TableCell
            className={classNames({ [classes.selected]: checked }, className)}
            {...rest}
        >
            {selectionMode !== 'single' ? (
                <BulkActionSelectItem
                    className={classes.selectAll}
                    resource={resource}
                    checked={checked}
                    ids={pageIds}
                    selectionMode={selectionMode}
                />
            ) : null}
        </TableCell>
    );
};

DatagridHeaderSelectCell.propTypes = {
    ids: PropTypes.array,
    classes: PropTypes.object,
    className: PropTypes.string,
    selection: PropTypes.array,
    selectionMode: PropTypes.oneOf(['single', 'page', 'bulk']),
    resource: PropTypes.string,
};

const enhance = compose(
    withStyles(styles),
    onlyUpdateForKeys(['ids', 'selection'])
);
export default enhance(DatagridHeaderSelectCell);
