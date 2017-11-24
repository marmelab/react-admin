import React from 'react';
import PropTypes from 'prop-types';
import defaultsDeep from 'lodash.defaultsdeep';
import shouldUpdate from 'recompose/shouldUpdate';
import compose from 'recompose/compose';
import { TableCell } from 'material-ui/Table';
import { withStyles } from 'material-ui/styles';
import DefaultHeaderCellContent from './DatagridHeaderCellContent';

const styles = {
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

export const DatagridHeaderCell = ({ field, defaultStyle, ...props }) => {
    const style = defaultsDeep(
        {},
        field.props.headerStyle,
        field.type.defaultProps ? field.type.defaultProps.headerStyle : {},
        defaultStyle
    );
    const tableCellContent = field.props.header || <DefaultHeaderCellContent />;

    return (
        <TableCell style={style}>
            {tableCellContent &&
                React.cloneElement(tableCellContent, {
                    field,
                    ...props,
                })}
        </TableCell>
    );
};

DatagridHeaderCell.propTypes = {
    classes: PropTypes.object,
    field: PropTypes.element,
    defaultStyle: PropTypes.shape({
        th: PropTypes.object,
        'th:first-child': PropTypes.object,
        sortButton: PropTypes.object,
        nonSortableLabel: PropTypes.object,
    }),
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
