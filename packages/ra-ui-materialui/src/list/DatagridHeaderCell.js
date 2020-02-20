import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shouldUpdate from 'recompose/shouldUpdate';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { FieldTitle, useTranslate } from 'ra-core';

// remove the sort icons when not active
const useStyles = makeStyles(
    {
        icon: {
            display: 'none',
        },
        active: {
            '& $icon': {
                display: 'inline',
            },
        },
    },
    { name: 'RaDatagridHeaderCell' }
);

export const DatagridHeaderCell = props => {
    const {
        className,
        classes: classesOverride,
        field,
        currentSort,
        updateSort,
        resource,
        isSorting,
        ...rest
    } = props;
    const classes = useStyles(props);
    const translate = useTranslate();
    return (
        <TableCell
            className={classnames(className, field.props.headerClassName)}
            align={field.props.textAlign}
            variant="head"
            {...rest}
        >
            {field.props.sortable !== false &&
            (field.props.sortBy || field.props.source) ? (
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
};

DatagridHeaderCell.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    field: PropTypes.element,
    currentSort: PropTypes.shape({
        sort: PropTypes.string,
        order: PropTypes.string,
    }).isRequired,
    isSorting: PropTypes.bool,
    sortable: PropTypes.bool,
    resource: PropTypes.string,
    updateSort: PropTypes.func.isRequired,
};

export default shouldUpdate(
    (props, nextProps) =>
        props.updateSort !== nextProps.updateSort ||
        props.currentSort.sort !== nextProps.currentSort.sort ||
        props.currentSort.order !== nextProps.currentSort.order ||
        (nextProps.isSorting && props.sortable !== nextProps.sortable)
)(DatagridHeaderCell);
