import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import { TableCell } from 'material-ui/Table';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import ContentSort from 'material-ui-icons/Sort';

import FieldTitle from '../../util/FieldTitle';

const styles = {
    cellRightAligned: { textAlign: 'right' },
    sortButton: {
        minWidth: 40,
    },
    sortIcon: {
        transition: 'transform .25s cubic-bezier(0.0, 0, 0.2, 1)',
        marginLeft: '0.5em',
    },
    sortIconReversed: {
        transform: 'rotate(180deg)',
    },
    nonSortableLabel: {
        position: 'relative',
        paddingLeft: 16,
        paddingRight: 16,
        verticalAlign: 'middle',
        letterSpacing: 0,
        textTransform: 'uppercase',
        fontWeight: 500,
        fontSize: 14,
    },
};

export const DatagridHeaderCell = ({
    classes = {},
    className,
    field,
    currentSort,
    updateSort,
    resource,
    isSorting,
    ...rest
}) => (
    <TableCell
        className={classnames(
            {
                [classes.cellRightAligned]: field.props.textAlign === 'right',
            },
            className,
            field.props.headerClassName
        )}
        {...rest}
    >
        {field.props.sortable !== false && field.props.source ? (
            <Button
                onClick={updateSort}
                data-sort={field.props.source}
                className={classes.sortButton}
            >
                <FieldTitle
                    label={field.props.label}
                    source={field.props.source}
                    resource={resource}
                />

                {field.props.source === currentSort.field && (
                    <ContentSort
                        className={classnames(
                            classes.sortIcon,
                            currentSort.order === 'ASC'
                                ? classes.sortIconReversed
                                : ''
                        )}
                    />
                )}
            </Button>
        ) : (
            <span className={classes.nonSortableLabel}>
                {
                    <FieldTitle
                        label={field.props.label}
                        source={field.props.source}
                        resource={resource}
                    />
                }
            </span>
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
    }),
    isSorting: PropTypes.bool,
    sortable: PropTypes.bool,
    resource: PropTypes.string,
    updateSort: PropTypes.func.isRequired,
};

const enhance = compose(
    shouldUpdate(
        (props, nextProps) =>
            props.isSorting !== nextProps.isSorting ||
            (nextProps.isSorting &&
                props.currentSort.order !== nextProps.currentSort.order)
    ),
    withStyles(styles)
);

export default enhance(DatagridHeaderCell);
