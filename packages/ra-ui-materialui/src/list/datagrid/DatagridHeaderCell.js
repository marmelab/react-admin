import * as React from 'react';
import { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { TableCell, TableSortLabel, Tooltip } from '@material-ui/core';
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
                        data-sort={field.props.sortBy || field.props.source} // @deprecated. Use data-field instead.
                        data-field={field.props.sortBy || field.props.source}
                        data-order={field.props.sortByOrder || 'ASC'}
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

export default memo(DatagridHeaderCell, (props, nextProps) => {
    return (
        props.updateSort === nextProps.updateSort &&
        props.currentSort.field === nextProps.currentSort.field &&
        props.currentSort.order === nextProps.currentSort.order &&
        !(nextProps.isSorting && props.sortable !== nextProps.sortable)
    );
});
