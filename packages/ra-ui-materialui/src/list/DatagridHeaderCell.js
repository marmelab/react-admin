import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { FieldTitle, translate } from 'ra-core';

// remove the sort icons when not active
const styles = {
    icon: {
        display: 'none',
    },
    active: {
        '& $icon': {
            display: 'inline',
        },
    },
};

export const DatagridHeaderCell = ({
    classes,
    className,
    field,
    currentSort,
    updateSort,
    resource,
    isSorting,
    translate,
    ...rest
}) => (
    <TableCell
        className={classnames(className, field.props.headerClassName)}
        numeric={field.props.textAlign === 'right'}
        padding="none"
        variant="head"
        {...rest}
    >
        {field.props.sortable !== false && field.props.source ? (
            <Tooltip
                title={translate('ra.action.sort')}
                placement={
                    field.props.textAlign === 'right'
                        ? 'bottom-end'
                        : 'bottom-start'
                }
                enterDelay={300}
            >
                <TableSortLabel
                    active={
                        currentSort.field ===
                        (field.props.sortBy || field.props.source)
                    }
                    direction={currentSort.order === 'ASC' ? 'asc' : 'desc'}
                    data-sort={field.props.sortBy || field.props.source}
                    onClick={updateSort}
                    classes={classes}
                >
                    <FieldTitle
                        label={field.props.label}
                        source={field.props.source}
                        resource={resource}
                    />
                </TableSortLabel>
            </Tooltip>
        ) : (
            <FieldTitle
                label={field.props.label}
                source={field.props.source}
                resource={resource}
            />
        )}
    </TableCell>
);

DatagridHeaderCell.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    field: PropTypes.element,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    isSorting: PropTypes.bool,
    sortable: PropTypes.bool,
    resource: PropTypes.string,
    translate: PropTypes.func.isRequired,
    updateSort: PropTypes.func.isRequired,
};

const enhance = compose(
    shouldUpdate(
        (props, nextProps) =>
            props.isSorting !== nextProps.isSorting ||
            (nextProps.isSorting &&
                props.currentSort.order !== nextProps.currentSort.order)
    ),
    translate,
    withStyles(styles)
);

export default enhance(DatagridHeaderCell);
